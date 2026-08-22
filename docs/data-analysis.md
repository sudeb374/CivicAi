# Data Analysis & Processing Documentation

This document describes the process of integrating REAL government datasets for the CivicAI platform. The final official source of truth is **`civic_data_howrah.csv`**, a fully verified government-derived dataset. 
*Note: Any old `infra_processed.csv` or `census_processed.csv` files were synthetic mocks and have been completely removed.*

## Source Datasets

### 1. Census 2011 Data
- **Filename**: `2011-IndiaStateDistSbDistVill-0000.xlsx` (Primary Census Abstract)
- **Number of records processed**: 650
- **Important Columns**: `State`, `District`, `Subdistt`, `Town/Village`, `Name`, `Level`, `TOT_P`, `No_HH`, `TOT_M`, `TOT_F`, `P_LIT`, `P_ILL`, `TOT_WORK_P`

### 2. Village Amenities Data
- **Filename**: `DCHB_Village_Amenities-West_Bengal-Haora-341.csv` (District Census Handbook - Village Amenities)
- **Number of records processed**: 650
- **Important Columns**: `Village Code`, `Village Name`, `Tap Water-Treated`, `Power Supply For All Users`, `Hospital Allopathic (Numbers)`, `Govt Primary School`, `Govt Secondary School`, `Black Topped (pucca) Road`, `Public Bus Service`, `ATM`

## Join Key & Validation
- **Join Key**: 
  - Census: `Town/Village` (numeric identifier, stripped of ".0")
  - Amenities: `Village Code` (numeric identifier, stripped of Excel-style leading quotes `"'"`).
- Both datasets perfectly match the official 2011 Census geographic coding scheme. A `LEFT JOIN` was performed from Census data to maintain the primary demographic dataset.
- **Matched Records**: 650
- **Unmatched Census**: 0
- **Unmatched Amenities**: 0
- **Duplicate Keys**: 0

## Processing Steps
1. **Census Filtering**: The 333MB Census dataset was filtered to keep only `Level == "VILLAGE"` (excluding state and district aggregations) and `District == "341"` (Howrah).
2. **Amenities Filtering**: The CSV was filtered for `District Code == "341"`.
3. **Data Cleaning**: String artifacts like trailing/leading spaces and quotes were removed from the Join Keys.
4. **Amenities Mapping**: Explicit `1` (Available) and `2` (Not Available) status columns were mapped strictly to boolean `True`/`False`. `Hospital Allopathic (Numbers)` was cast to numeric and converted to a `Has_Hospital` boolean if count > 0.
5. **Merge**: An inner/left join matched the 650 villages 1:1.
6. **Export**: Saved to `backend/data/processed/civic_data_howrah.csv`.

## Missing-Value Handling
- **Amenities Booleans**: Missing values (`NaN`) inside binary availability columns (`Status A(1)/NA(2)`) are intentionally left as `NaN` (Missing) rather than incorrectly defaulting to `False`.
- **Hospital Counts**: Missing values (`NaN`) were explicitly filled with `0` before calculating the boolean `Has_Hospital`.
- **Distance Values**: Text-based distance buckets (e.g., `a for < 5 Kms`) present in the CSV were ignored entirely in the boolean mappings to avoid polluting numeric/boolean fields with strings. 

## Limitations
- Distance metrics are currently excluded from the boolean representation. In future phases, these strings can be parsed to create partial gap scores (e.g. facility not in village, but <5km away).
