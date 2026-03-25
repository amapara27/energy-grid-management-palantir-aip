import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)

circuit_ids = [f"C-{i:02d}" for i in range(1, 21)]
forecast_time = datetime.now() + timedelta(hours=8)

rows = []
for i, cid in enumerate(circuit_ids):
    if cid == "C-07":
        wind = 52.0
        humidity = round(np.random.uniform(8.0, 14.9), 1)
        red_flag = True
    else:
        wind = round(np.random.uniform(2.0, 14.9), 1)
        humidity = round(np.random.uniform(30.0, 75.0), 1)
        red_flag = False

    rows.append({
        "forecast_id": f"WF-{i+1:03d}",
        "circuit_id": cid,
        "wind_speed_mph": wind,
        "humidity_pct": humidity,
        "red_flag_warning": red_flag,
        "forecast_timestamp": forecast_time.isoformat(),
    })

df = pd.DataFrame(rows)
df.to_csv("weather_forecast.csv", index=False)
print(f"Generated {len(df)} rows -> Data/weather_forecast.csv")
print(df[df["circuit_id"] == "C-07"].to_string(index=False))
