#!/usr/bin/env python3
"""
Generate realistic synthetic SCADA telemetry for 500 transformers over 6 months
at 15-minute intervals (~1.5M rows). Models physical relationships between
load, oil temperature, and voltage, and injects anomaly signatures.
"""

import numpy as np
import pandas as pd
from datetime import datetime

# ── Configuration ────────────────────────────────────────────────────────────
NUM_TRANSFORMERS = 500
START_DATE = "2025-01-01"
END_DATE = "2025-07-01"
INTERVAL_MINUTES = 15
OUTPUT_FILE = "scada_telemetry.csv"
SEED = 42

# Anomaly ground-truth definitions
# Each: (transformer_id, anomaly_start, duration_hours, description)
ANOMALIES = [
    ("TX-042", "2025-02-10 14:00", 48, "cooling_failure"),
    ("TX-187", "2025-03-22 08:00", 36, "cooling_failure"),
    ("TX-305", "2025-04-15 20:00", 24, "partial_discharge"),
    ("TX-411", "2025-05-08 02:00", 60, "cooling_failure"),
    ("TX-099", "2025-06-12 10:00", 30, "overload_thermal_runaway"),
]

np.random.seed(SEED)

# ── Time axis ────────────────────────────────────────────────────────────────
timestamps = pd.date_range(start=START_DATE, end=END_DATE, freq=f"{INTERVAL_MINUTES}min", inclusive="left")
n_steps = len(timestamps)
print(f"Time steps per transformer: {n_steps}")
print(f"Total rows: {n_steps * NUM_TRANSFORMERS:,}")

# Precompute hour-of-day fractional for diurnal curve
hour_frac = timestamps.hour + timestamps.minute / 60.0

# ── Diurnal load curve (shared shape, per-transformer scaling) ───────────────
# Two-peak model: morning ramp + afternoon/evening peak
def diurnal_curve(hours: np.ndarray) -> np.ndarray:
    """Normalized 0-1 diurnal load shape."""
    morning = 0.3 * np.exp(-0.5 * ((hours - 8) / 2.0) ** 2)
    evening = 1.0 * np.exp(-0.5 * ((hours - 18) / 3.0) ** 2)
    base = 0.25
    curve = base + morning + evening
    return curve / curve.max()

diurnal = diurnal_curve(hour_frac.values)  # shape (n_steps,)

# Seasonal multiplier: higher load in winter (heating) and summer (cooling)
day_of_year = timestamps.dayofyear.values
seasonal = 1.0 + 0.15 * np.cos(2 * np.pi * (day_of_year - 15) / 365)  # peaks ~Jan 15


# ── Per-transformer profiles ─────────────────────────────────────────────────
# Each transformer gets a unique baseline load, thermal coefficient, and noise level
tx_ids = [f"TX-{i+1:03d}" for i in range(NUM_TRANSFORMERS)]

# Rated load range 200-600 A; each TX has a random rated load
rated_loads = np.random.uniform(200, 600, NUM_TRANSFORMERS)
# Thermal coefficient: how much oil temp rises per amp of load (°C/A)
thermal_coeffs = np.random.uniform(0.04, 0.08, NUM_TRANSFORMERS)
# Base oil temp (ambient contribution)
base_oil_temps = np.random.uniform(38, 55, NUM_TRANSFORMERS)
# Nominal voltage per transformer (slight variation around 12kV)
nominal_voltages = np.random.normal(12000, 50, NUM_TRANSFORMERS)
# Voltage droop coefficient (V drop per A of load)
voltage_droop = np.random.uniform(0.5, 1.5, NUM_TRANSFORMERS)

# ── Build dataset in chunks for memory efficiency ────────────────────────────
print("Generating telemetry...")

chunks = []
CHUNK_SIZE = 50  # transformers per chunk

# Pre-parse anomaly windows for fast lookup
anomaly_windows = []
for tx_id, start_str, dur_h, atype in ANOMALIES:
    tx_idx = int(tx_id.split("-")[1]) - 1
    a_start = pd.Timestamp(start_str)
    a_end = a_start + pd.Timedelta(hours=dur_h)
    anomaly_windows.append((tx_idx, a_start, a_end, atype))

for chunk_start in range(0, NUM_TRANSFORMERS, CHUNK_SIZE):
    chunk_end = min(chunk_start + CHUNK_SIZE, NUM_TRANSFORMERS)
    chunk_n = chunk_end - chunk_start

    # ── Load amps ────────────────────────────────────────────────────────
    # shape: (chunk_n, n_steps)
    load_base = rated_loads[chunk_start:chunk_end, None] * diurnal[None, :] * seasonal[None, :]
    # Add correlated slow drift (random walk smoothed)
    drift = np.cumsum(np.random.normal(0, 0.3, (chunk_n, n_steps)), axis=1)
    # Smooth drift with a rolling window via convolution
    kernel = np.ones(96) / 96  # 24-hour smoothing at 15-min intervals
    for i in range(chunk_n):
        drift[i] = np.convolve(drift[i], kernel, mode="same")
    load_amps = load_base + drift + np.random.normal(0, 5, (chunk_n, n_steps))
    load_amps = np.clip(load_amps, 10, None)  # physical floor

    # ── Oil temperature (lagged response to load) ────────────────────────
    # Exponential moving average to simulate thermal lag (~1 hour time constant)
    alpha = 1 - np.exp(-INTERVAL_MINUTES / 60.0)  # ~15 min / 60 min time constant
    oil_temp = np.empty_like(load_amps)
    equilibrium = base_oil_temps[chunk_start:chunk_end, None] + \
                  thermal_coeffs[chunk_start:chunk_end, None] * load_amps
    oil_temp[:, 0] = equilibrium[:, 0]
    for t in range(1, n_steps):
        oil_temp[:, t] = oil_temp[:, t - 1] + alpha * (equilibrium[:, t] - oil_temp[:, t - 1])
    # Sensor noise
    oil_temp += np.random.normal(0, 0.5, oil_temp.shape)

    # ── Voltage (inverse relationship with load) ─────────────────────────
    voltage = nominal_voltages[chunk_start:chunk_end, None] - \
              voltage_droop[chunk_start:chunk_end, None] * (load_amps - rated_loads[chunk_start:chunk_end, None] * 0.5)
    voltage += np.random.normal(0, 10, voltage.shape)

    # ── Inject anomalies for transformers in this chunk ──────────────────
    for tx_idx, a_start, a_end, atype in anomaly_windows:
        if chunk_start <= tx_idx < chunk_end:
            local_idx = tx_idx - chunk_start
            mask = (timestamps >= a_start) & (timestamps < a_end)
            mask_indices = np.where(mask)[0]
            n_anom = len(mask_indices)

            if atype == "cooling_failure":
                # Oil temp ramps up independently of load, reaching 90-110°C
                ramp = np.linspace(0, 1, n_anom)
                peak_temp = np.random.uniform(92, 110)
                oil_temp[local_idx, mask_indices] = base_oil_temps[tx_idx] + ramp * (peak_temp - base_oil_temps[tx_idx])
                oil_temp[local_idx, mask_indices] += np.random.normal(0, 0.8, n_anom)
                # Load stays normal (already set) — decoupled

            elif atype == "partial_discharge":
                # Voltage instability: sudden drops and spikes
                voltage[local_idx, mask_indices] += np.random.normal(0, 150, n_anom)
                # Slight oil temp bump from internal arcing
                oil_temp[local_idx, mask_indices] += np.random.uniform(5, 15, n_anom)

            elif atype == "overload_thermal_runaway":
                # Load spikes well above rated, oil temp follows but overshoots
                ramp = np.linspace(1.0, 1.8, n_anom)
                load_amps[local_idx, mask_indices] *= ramp
                # Oil temp runaway — faster than normal thermal response
                oil_temp[local_idx, mask_indices] = base_oil_temps[tx_idx] + \
                    thermal_coeffs[tx_idx] * load_amps[local_idx, mask_indices] * 1.5
                oil_temp[local_idx, mask_indices] += np.linspace(0, 25, n_anom)

    # ── Assemble chunk DataFrame ─────────────────────────────────────────
    for i in range(chunk_n):
        global_idx = chunk_start + i
        df_chunk = pd.DataFrame({
            "transformer_id": tx_ids[global_idx],
            "timestamp": timestamps,
            "oil_temp_C": np.round(oil_temp[i], 2),
            "load_amps": np.round(load_amps[i], 2),
            "voltage": np.round(voltage[i], 2),
        })
        chunks.append(df_chunk)

    pct = chunk_end / NUM_TRANSFORMERS * 100
    print(f"  {chunk_end}/{NUM_TRANSFORMERS} transformers ({pct:.0f}%)")

# ── Concatenate and export ───────────────────────────────────────────────────
print("Concatenating...")
df = pd.concat(chunks, ignore_index=True)
print(f"Final shape: {df.shape}")

print(f"Writing to {OUTPUT_FILE}...")
df.to_csv(OUTPUT_FILE, index=False)
print("Done.")

# ── Print anomaly ground truth for reference ─────────────────────────────────
print("\n=== ANOMALY GROUND TRUTH ===")
print(f"{'Transformer':<15} {'Start':<22} {'Duration (h)':<15} {'Type'}")
print("-" * 70)
for tx_id, start_str, dur_h, atype in ANOMALIES:
    print(f"{tx_id:<15} {start_str:<22} {dur_h:<15} {atype}")
