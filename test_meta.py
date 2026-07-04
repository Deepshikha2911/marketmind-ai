import pandas as pd

df = pd.read_csv("data/raw/meta_ads_campaign_stats.csv")

print(df[["conversion"]].describe())