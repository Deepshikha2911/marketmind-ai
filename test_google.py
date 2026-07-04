import pandas as pd

df = pd.read_csv("data/raw/google_ads_campaign_stats.csv")

print(df["campaign_budget_amount"].head())