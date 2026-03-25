import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)

# ── Dataset 1: Maintenance Work Orders (60 rows) ──

crews = [
    "Crew-Alpha", "Crew-Bravo", "Crew-Charlie", "Crew-Delta", "Crew-Echo",
    "Crew-Foxtrot", "Crew-Golf", "Crew-Hotel", "Crew-India", "Crew-Juliet",
    "Crew-Kilo", "Crew-Lima", "Crew-Mike", "Crew-November", "Crew-Oscar",
]

transformer_ids = [f"TX-{i:03d}" for i in range(1, 501)]

now = datetime.now()
twelve_months_ago = now - timedelta(days=365)

# Guarantee at least 10 URGENT rows
priorities = ["URGENT"] * 10 + list(
    np.random.choice(
        ["ROUTINE", "HIGH", "URGENT"],
        size=50,
        p=[0.60, 0.30, 0.10],
    )
)
np.random.shuffle(priorities)

wo_rows = []
for i in range(60):
    random_offset = np.random.randint(0, 365 * 24 * 60)
    created = twelve_months_ago + timedelta(minutes=int(random_offset))

    wo_rows.append({
        "WO_ID": f"WO-{1001 + i}",
        "Transformer_ID": np.random.choice(transformer_ids),
        "Priority": priorities[i],
        "Status": "COMPLETED",
        "Assigned_Crew": np.random.choice(crews),
        "Created_Timestamp": created.strftime("%Y-%m-%dT%H:%M:%S"),
        "ERP_Reference_ID": f"SAP-{np.random.randint(10000, 99999)}",
    })

df_wo = pd.DataFrame(wo_rows)
df_wo.to_csv("maintenance_history.csv", index=False)

urgent_count = (df_wo["Priority"] == "URGENT").sum()
print(f"maintenance_history.csv  -> {len(df_wo)} rows  ({urgent_count} URGENT)")

# ── Dataset 2: Crew Staffing (15 rows) ──

lead_names = [
    "Marcus Rivera", "Priya Sharma", "James O'Brien", "Fatima Al-Hassan",
    "Chen Wei", "Sarah Kowalski", "David Okonkwo", "Maria Santos",
    "Raj Patel", "Emily Larsson", "Tomás García", "Aisha Johnson",
    "Liam Nakamura", "Grace Mbeki", "Andrei Volkov",
]

skills_pool = [
    "HV Electrical", "Transformer Specialist", "Line Crew",
    "Substation Maintenance", "Relay Protection", "Cable Splicing",
    "Distribution Automation", "Metering Systems",
]

regions = [
    "Northern Corridor", "Downtown", "Valley", "Industrial Park",
    "Coastal Zone", "Eastern Ridge", "Suburban West",
]

statuses = ["AVAILABLE", "ON_JOB"]

crew_rows = []
for i, crew_id in enumerate(crews):
    num_skills = np.random.randint(1, 4)
    selected_skills = ", ".join(np.random.choice(skills_pool, size=num_skills, replace=False))

    crew_rows.append({
        "crew_id": crew_id,
        "lead_name": lead_names[i],
        "skills": selected_skills,
        "on_call_region": np.random.choice(regions),
        "current_status": np.random.choice(statuses, p=[0.6, 0.4]),
    })

df_crew = pd.DataFrame(crew_rows)
df_crew.to_csv("crew_staffing.csv", index=False)

print(f"crew_staffing.csv        -> {len(df_crew)} rows")
