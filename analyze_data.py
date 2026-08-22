import pandas as pd
import json

def analyze_excel():
    print("Reading Excel...")
    df = pd.read_excel("backend/data/raw/2011-IndiaStateDistSbDistVill-0000.xlsx", engine="openpyxl", nrows=100) # getting only 100 rows to find cols & dtypes for now to avoid OOM
    res = {
        "rows": "Skipped full read to avoid OOM, checking later if needed.",
        "columns": len(df.columns),
        "column_names": list(df.columns),
        "dtypes": df.dtypes.astype(str).to_dict(),
        "sample": df.head(5).to_dict(orient="records")
    }
    with open("excel_analysis.json", "w") as f:
        json.dump(res, f, indent=2)
    print("Excel done.")

def analyze_csv():
    print("Reading CSV...")
    df = pd.read_csv("backend/data/raw/DCHB_Village_Amenities-West_Bengal-Haora-341.csv", low_memory=False)
    res = {
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": list(df.columns),
        "dtypes": df.dtypes.astype(str).to_dict(),
        "missing_count": int(df.isnull().sum().sum()),
        "duplicates": int(df.duplicated().sum()),
        "sample": df.head(5).to_dict(orient="records")
    }
    with open("csv_analysis.json", "w") as f:
        json.dump(res, f, indent=2)
    print("CSV done.")

if __name__ == "__main__":
    analyze_csv()
    analyze_excel()
