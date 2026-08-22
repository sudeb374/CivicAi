import pandas as pd
import numpy as np
import json

def main():
    print("Loading Census Data...")
    # Read the real Census 2011 XLSX file
    census = pd.read_excel("backend/data/raw/2011-IndiaStateDistSbDistVill-0000.xlsx", engine="openpyxl")
    
    # 1. Census filtering: Keep only village-level rows (exclude state/district aggregations)
    census = census[census["Level"] == "VILLAGE"]
    
    # 2. Howrah district filtering: District Code for Howrah is 341 in West Bengal
    census = census[census["District"].astype(str) == "341"]
    
    # Keep important demographic fields
    census_cols = ['State', 'District', 'Subdistt', 'Town/Village', 'Name', 'Level', 'TOT_P', 'No_HH', 'TOT_M', 'TOT_F', 'P_LIT', 'P_ILL', 'TOT_WORK_P']
    census_cols = [c for c in census_cols if c in census.columns]
    census = census[census_cols].copy()
    
    # Clean Census Village Code to match exactly with Amenities Village Code
    census["Town/Village"] = census["Town/Village"].astype(str).str.strip().str.replace(".0", "", regex=False)
    
    print(f"Census data filtered: {len(census)} rows.")
    
    print("Loading Amenities Data...")
    # Read the real Village Amenities CSV file
    amenities = pd.read_csv("backend/data/raw/DCHB_Village_Amenities-West_Bengal-Haora-341.csv", low_memory=False)
    
    # Ensure District Code is 341 (strip Excel-style leading quotes if present)
    amenities["District Code"] = amenities["District Code"].astype(str).str.replace("'", "", regex=False).str.strip()
    amenities = amenities[amenities["District Code"] == "341"]
    
    # Clean Amenities Village Code to match exactly with Census Town/Village
    amenities["Village Code"] = amenities["Village Code"].astype(str).str.replace("'", "", regex=False).str.strip()
    
    print(f"Amenities data filtered: {len(amenities)} rows.")
    
    # Select useful infrastructure fields
    amenities_cols = [
        "Village Code", "Village Name",
        "Tap Water-Treated (Status A(1)/NA(2))",
        "Power Supply For All Users (Status A(1)/NA(2))",
        "Hospital Allopathic (Numbers)",
        "Govt Primary School (Status A(1)/NA(2))",
        "Govt Secondary School (Status A(1)/NA(2))",
        "Black Topped (pucca) Road (Status A(1)/NA(2))",
        "Public Bus Service (Status A(1)/NA(2))",
        "ATM (Status A(1)/NA(2))"
    ]
    amenities = amenities[amenities_cols].copy()
    
    # 3. Amenities processing & Missing-value handling
    # Convert explicit '1' (Available) and '2' (Not Available) to standard Booleans
    # Missing values (NaN) are safely left as NaN rather than assumed False
    # Distance values like 'a for < 5 Kms' are implicitly ignored by this direct map.
    bool_cols = [
        "Tap Water-Treated (Status A(1)/NA(2))",
        "Power Supply For All Users (Status A(1)/NA(2))",
        "Govt Primary School (Status A(1)/NA(2))",
        "Govt Secondary School (Status A(1)/NA(2))",
        "Black Topped (pucca) Road (Status A(1)/NA(2))",
        "Public Bus Service (Status A(1)/NA(2))",
        "ATM (Status A(1)/NA(2))"
    ]
    
    for c in bool_cols:
        amenities[c] = amenities[c].map({1: True, 1.0: True, '1': True, '1.0': True, 2: False, 2.0: False, '2': False, '2.0': False})
    
    # Hospital is a count, convert to a simple Has_Hospital boolean, treating missing/NaN as 0
    amenities["Hospital Allopathic (Numbers)"] = pd.to_numeric(amenities["Hospital Allopathic (Numbers)"], errors='coerce').fillna(0)
    amenities["Has_Hospital"] = amenities["Hospital Allopathic (Numbers)"] > 0
    
    print("Joining datasets...")
    # 4. Village-code matching: LEFT JOIN keeps all Census demographic villages even if amenities are missing
    joined = pd.merge(census, amenities, left_on="Town/Village", right_on="Village Code", how="left")
    
    # Validation checks
    matched = joined["Village Code"].notna().sum()
    unmatched = joined["Village Code"].isna().sum()
    duplicate_keys = joined.duplicated(subset=["Town/Village"]).sum()
    unmatched_amenities = len(set(amenities["Village Code"]) - set(census["Town/Village"]))
    
    print(f"Matched: {matched}")
    print(f"Unmatched Census: {unmatched}")
    print(f"Unmatched Amenities: {unmatched_amenities}")
    print(f"Duplicate Keys: {duplicate_keys}")
    
    # Output
    out_path = "backend/data/processed/civic_data_howrah.csv"
    joined.to_csv(out_path, index=False)
    print(f"Saved to {out_path}")
    print(f"Final rows: {len(joined)}, cols: {len(joined.columns)}")

if __name__ == '__main__':
    main()
