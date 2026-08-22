# Data Processing Documentation

## Source Files
- **Census Data**: `backend/data/raw/2011-IndiaStateDistSbDistVill-0000.xlsx` (Primary Census Abstract 2011)
- **Amenities Data**: `backend/data/raw/DCHB_Village_Amenities-West_Bengal-Haora-341.csv` (Village Amenities for Howrah District)

## Filtering Logic
- **Census Data**: Filtered for `Level == "VILLAGE"` and `District == "341"` (Howrah). Result: 650 rows.
- **Amenities Data**: Filtered for `District Code == "341"` after stripping single quotes from the fields. Result: 650 rows.

## Columns Selected
**Census**: `State`, `District`, `Subdistt`, `Town/Village`, `Name`, `Level`, `TOT_P`, `No_HH`, `TOT_M`, `TOT_F`, `P_LIT`, `P_ILL`, `TOT_WORK_P`
**Amenities**: 
- `Village Code`
- `Village Name`
- `Tap Water-Treated (Status A(1)/NA(2))`
- `Power Supply For All Users (Status A(1)/NA(2))`
- `Hospital Allopathic (Numbers)`
- `Govt Primary School (Status A(1)/NA(2))`
- `Govt Secondary School (Status A(1)/NA(2))`
- `Black Topped (pucca) Road (Status A(1)/NA(2))`
- `Public Bus Service (Status A(1)/NA(2))`
- `ATM (Status A(1)/NA(2))`

## Status Code Mappings
- **1 / 1.0 / '1'**: `True` (Available)
- **2 / 2.0 / '2'**: `False` (Not Available)
- Allopathic Hospital numbers converted to a boolean field `Has_Hospital` (>0 = True).

## Distance Handling
Fields with distance buckets like `a for < 5 Kms` or `b for 5-10 Kms` were intentionally ignored from the boolean mask mappings, as treating them as numeric or boolean without complex interpolation would corrupt data quality. Distance metrics are preserved in raw columns for future processing if needed.

## Join Validation
- **Census**: `Town/Village` (Numeric/String Code stripped of `.0`)
- **Amenities**: `Village Code` (Numeric/String Code stripped of trailing quotes)
A `LEFT JOIN` was performed from Census data to maintain the primary demographic dataset.
- **Matched Records**: 650
- **Unmatched Census**: 0
- **Unmatched Amenities**: 0
- **Duplicate Keys**: 0
- **Final Joined Rows**: 650
- **Final Columns**: 24

## Limitations
- Distance logic requires more nuanced mapping in future phases if we wish to use `a for < 5 Kms` as a partial priority score.
