import os
import sys
import pandas as pd
from sqlalchemy.orm import Session

# Add project root to path for imports to work
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.database import engine, Base, SessionLocal
from backend.models import District, Demographic, Infrastructure

def main():
    # 1. Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # 2. Read processed dataset
    data_path = "backend/data/processed/civic_data_howrah.csv"
    if not os.path.exists(data_path):
        print(f"Error: Could not find dataset at {data_path}")
        return
        
    df = pd.read_csv(data_path)
    
    # Track metrics
    districts_inserted = 0
    demographics_inserted = 0
    infrastructures_inserted = 0
    
    print("Seeding database...")
    
    try:
        # Seed District (Assuming all records are from Howrah 341 based on Phase 2C)
        # Check if exists first
        district_id = "341"
        state_code = "19"
        district_name = "Howrah"
        
        district = db.query(District).filter(District.id == district_id).first()
        if not district:
            district = District(id=district_id, state_code=state_code, name=district_name)
            db.add(district)
            db.commit()
            districts_inserted += 1
            
        # Seed Demographics & Infrastructure
        for idx, row in df.iterrows():
            village_code = str(row["Village Code"])
            
            # Demographic
            demo = db.query(Demographic).filter(Demographic.village_code == village_code).first()
            if not demo:
                demo = Demographic(
                    village_code=village_code,
                    district_id=district_id,
                    subdistt=str(row["Subdistt"]),
                    village_name=str(row["Village Name"]),
                    tot_p=int(row["TOT_P"]) if pd.notna(row["TOT_P"]) else 0,
                    no_hh=int(row["No_HH"]) if pd.notna(row["No_HH"]) else 0,
                    tot_m=int(row["TOT_M"]) if pd.notna(row["TOT_M"]) else 0,
                    tot_f=int(row["TOT_F"]) if pd.notna(row["TOT_F"]) else 0,
                    p_lit=int(row["P_LIT"]) if pd.notna(row["P_LIT"]) else 0,
                    p_ill=int(row["P_ILL"]) if pd.notna(row["P_ILL"]) else 0,
                    tot_work_p=int(row["TOT_WORK_P"]) if pd.notna(row["TOT_WORK_P"]) else 0
                )
                db.add(demo)
                demographics_inserted += 1
                
            # Infrastructure
            infra = db.query(Infrastructure).filter(Infrastructure.village_code == village_code).first()
            if not infra:
                def safe_bool(val):
                    if pd.isna(val):
                        return None
                    return bool(val)
                
                infra = Infrastructure(
                    village_code=village_code,
                    tap_water_treated=safe_bool(row.get("Tap Water-Treated (Status A(1)/NA(2))")),
                    power_supply=safe_bool(row.get("Power Supply For All Users (Status A(1)/NA(2))")),
                    govt_primary_school=safe_bool(row.get("Govt Primary School (Status A(1)/NA(2))")),
                    govt_secondary_school=safe_bool(row.get("Govt Secondary School (Status A(1)/NA(2))")),
                    pucca_road=safe_bool(row.get("Black Topped (pucca) Road (Status A(1)/NA(2))")),
                    public_bus=safe_bool(row.get("Public Bus Service (Status A(1)/NA(2))")),
                    atm=safe_bool(row.get("ATM (Status A(1)/NA(2))")),
                    has_hospital=safe_bool(row.get("Has_Hospital"))
                )
                db.add(infra)
                infrastructures_inserted += 1
                
        db.commit()
        
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        db.close()
        
    print("\nSeed Results:")
    print(f"Districts inserted: {districts_inserted}")
    print(f"Demographics inserted: {demographics_inserted}")
    print(f"Infrastructure inserted: {infrastructures_inserted}")

if __name__ == "__main__":
    main()
