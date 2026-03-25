import pandas as pd
import random

# Load your existing dataset
df = pd.read_csv(r"C:\Users\TANISH VERMA\OneDrive\Desktop\gramsevak ml\gram_sevak_dataset.csv")

categories = ["Water", "Electricity", "Road", "Sanitation", "Others"]

locations = [
    "ward 1", "ward 2", "ward 3", "ward 4", "ward 5",
    "temple road", "school area", "bus stand",
    "market area", "hospital road", "village center"
]

issues = {
    "Water": [
        "no water supply", "water leakage", "dirty drinking water",
        "broken pipeline", "low water pressure", "water tank overflow"
    ],
    "Electricity": [
        "power cut", "street light not working", "electric pole damaged",
        "voltage fluctuation", "transformer failure", "loose wiring"
    ],
    "Road": [
        "potholes on road", "damaged road surface", "road blocked",
        "cracked cement road", "waterlogged road", "incomplete road work"
    ],
    "Sanitation": [
        "garbage not collected", "drain blocked", "sewage overflow",
        "bad smell from drainage", "waste dumped", "stagnant water issue"
    ],
    "Others": [
        "request for new ration card", "pension delay",
        "stray animal problem", "public park maintenance issue",
        "need speed breaker", "community hall repair request"
    ]
}

new_rows = []
start_id = df["id"].max() + 1

for i in range(400):
    category = random.choice(categories)
    issue = random.choice(issues[category])
    location = random.choice(locations)

    sentence = f"There is {issue} in {location}."
    new_rows.append([start_id + i, sentence, category])

new_df = pd.DataFrame(new_rows, columns=["id", "text", "category"])

# Combine old + new
final_df = pd.concat([df, new_df], ignore_index=True)

# Save updated dataset
final_df.to_csv("gram_sevak_500_complaints_dataset.csv", index=False)

print("Dataset expanded to 500 rows successfully!")