#!/usr/bin/env python3
"""
Generate two synthetic GIS / Asset Management datasets:
  1. transformer_registry.csv  – 500 transformers across 20 circuits
  2. circuit_topology.csv      – 20 circuit definitions with zones
"""

import numpy as np
import pandas as pd

SEED = 42
np.random.seed(SEED)

OUTPUT_DIR = "data_generation"
NUM_TRANSFORMERS = 500
NUM_CIRCUITS = 20

# ── Circuit definitions ──────────────────────────────────────────────────────
ZONES = [
    "Northern Corridor", "Downtown", "Valley", "Industrial Park",
    "Lakeside", "Eastside", "Westside", "Hilltop",
    "Riverside", "Suburban South", "Airport District", "University Quarter",
    "Harbor", "Midtown", "Old Town", "Tech Campus",
    "Prairie Edge", "Forest Glen", "Commerce Row", "Bayfront",
]

circuit_ids = [f"C-{i+1:02d}" for i in range(NUM_CIRCUITS)]

# Each circuit gets a geographic cluster center (lat/lng within ~50-mile radius of a city center)
CITY_CENTER = (33.45, -112.07)  # generic metro area
RADIUS_DEG = 0.6  # ~40-50 miles in degrees at this latitude

# Generate 20 cluster centers spread around the city
angles = np.linspace(0, 2 * np.pi, NUM_CIRCUITS, endpoint=False) + np.random.normal(0, 0.15, NUM_CIRCUITS)
radii = np.random.uniform(0.1, RADIUS_DEG, NUM_CIRCUITS)
cluster_lats = CITY_CENTER[0] + radii * np.sin(angles)
cluster_lngs = CITY_CENTER[1] + radii * np.cos(angles)

circuit_topology = pd.DataFrame({
    "circuit_id": circuit_ids,
    "geographic_zone": ZONES[:NUM_CIRCUITS],
    "max_wind_threshold_mph": np.random.randint(40, 61, NUM_CIRCUITS),
})

# ── Transformer registry ────────────────────────────────────────────────────
tx_ids = [f"TX-{i+1:03d}" for i in range(NUM_TRANSFORMERS)]

# Distribute transformers across circuits (25 each, balanced)
assigned_circuits = np.tile(np.arange(NUM_CIRCUITS), NUM_TRANSFORMERS // NUM_CIRCUITS)
np.random.shuffle(assigned_circuits)

# Clustered coordinates: scatter around each circuit's cluster center
CLUSTER_SPREAD = 0.04  # ~2-3 miles spread within each circuit cluster
lats = cluster_lats[assigned_circuits] + np.random.normal(0, CLUSTER_SPREAD, NUM_TRANSFORMERS)
lngs = cluster_lngs[assigned_circuits] + np.random.normal(0, CLUSTER_SPREAD, NUM_TRANSFORMERS)

# Age: ~85% between 1-20 years, ~15% between 21-45 years (aging infrastructure)
n_old = int(NUM_TRANSFORMERS * 0.15)
n_young = NUM_TRANSFORMERS - n_old
ages = np.concatenate([
    np.random.randint(1, 21, n_young),
    np.random.randint(21, 46, n_old),
])
np.random.shuffle(ages)

# Last inspection date: random over last 5 years from 2025-07-01
end_date = pd.Timestamp("2025-07-01")
random_days_back = np.random.randint(0, 5 * 365, NUM_TRANSFORMERS)
inspection_dates = [end_date - pd.Timedelta(days=int(d)) for d in random_days_back]

transformer_registry = pd.DataFrame({
    "transformer_id": tx_ids,
    "circuit_id": [circuit_ids[c] for c in assigned_circuits],
    "lat": np.round(lats, 6),
    "lng": np.round(lngs, 6),
    "age_years": ages,
    "last_inspection_date": [d.strftime("%Y-%m-%d") for d in inspection_dates],
})

# ── Export ───────────────────────────────────────────────────────────────────
transformer_registry.to_csv(f"transformer_registry.csv", index=False)
circuit_topology.to_csv(f"circuit_topology.csv", index=False)

print(f"transformer_registry.csv: {len(transformer_registry)} rows")
print(f"  Age > 20 years: {(ages > 20).sum()} ({(ages > 20).mean()*100:.1f}%)")
print(f"  Circuits used: {transformer_registry['circuit_id'].nunique()}")
print(f"\ncircuit_topology.csv: {len(circuit_topology)} rows")
print("Done.")
