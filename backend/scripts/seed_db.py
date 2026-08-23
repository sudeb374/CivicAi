import os
import sys
import csv

# Add project root to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.database import engine, Base, SessionLocal
from backend.models import District, Demographic, Infrastructure

def parse_bool(val):
    if val is None or val == "" or str(val).strip().lower() in ("nan", "none", "null", ""):
        return None
    s = str(val).strip().lower()
    return s in ("true", "1", "1.0", "a", "a(1)", "yes")

def parse_int(val):
    try:
        if val is None or val == "":
            return 0
        return int(float(val))
    except (ValueError, TypeError):
        return 0

def seed_database(db=None):
    """
    Idempotently seeds the database with the real Howrah government dataset.
    Can be called programmatically or via CLI.
    """
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    close_session_at_end = False
    if db is None:
        db = SessionLocal()
        close_session_at_end = True
        
    data_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "data", "processed", "civic_data_howrah.csv"
    )
    
    if not os.path.exists(data_path):
        print(f"Dataset not found at: {data_path}")
        if close_session_at_end:
            db.close()
        return {
            "districts_inserted": 0,
            "demographics_inserted": 0,
            "infrastructure_inserted": 0
        }
        
    districts_inserted = 0
    demographics_inserted = 0
    infrastructure_inserted = 0
    
    try:
        # 1. Seed Howrah District (ID: 341)
        district_id = "341"
        state_code = "19"
        district_name = "Howrah"
        
        district = db.query(District).filter(District.id == district_id).first()
        if not district:
            district = District(id=district_id, state_code=state_code, name=district_name)
            db.add(district)
            db.commit()
            districts_inserted += 1
            
        # 2. Check if Demographics already populated
        existing_count = db.query(Demographic).count()
        if existing_count >= 650:
            if close_session_at_end:
                db.close()
            return {
                "districts_inserted": districts_inserted,
                "demographics_inserted": 0,
                "infrastructure_inserted": 0
            }
            
        # 3. Read processed dataset
        with open(data_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                village_code = str(row["Village Code"]).strip()
                
                # Check demographic
                demo = db.query(Demographic).filter(Demographic.village_code == village_code).first()
                if not demo:
                    demo = Demographic(
                        village_code=village_code,
                        district_id=district_id,
                        subdistt=str(row.get("Subdistt", "")),
                        village_name=str(row.get("Village Name", "")),
                        tot_p=parse_int(row.get("TOT_P")),
                        no_hh=parse_int(row.get("No_HH")),
                        tot_m=parse_int(row.get("TOT_M")),
                        tot_f=parse_int(row.get("TOT_F")),
                        p_lit=parse_int(row.get("P_LIT")),
                        p_ill=parse_int(row.get("P_ILL")),
                        tot_work_p=parse_int(row.get("TOT_WORK_P"))
                    )
                    db.add(demo)
                    demographics_inserted += 1
                    
                # Check infrastructure
                infra = db.query(Infrastructure).filter(Infrastructure.village_code == village_code).first()
                if not infra:
                    infra = Infrastructure(
                        village_code=village_code,
                        tap_water_treated=parse_bool(row.get("Tap Water-Treated (Status A(1)/NA(2))")),
                        power_supply=parse_bool(row.get("Power Supply For All Users (Status A(1)/NA(2))")),
                        govt_primary_school=parse_bool(row.get("Govt Primary School (Status A(1)/NA(2))")),
                        govt_secondary_school=parse_bool(row.get("Govt Secondary School (Status A(1)/NA(2))")),
                        pucca_road=parse_bool(row.get("Black Topped (pucca) Road (Status A(1)/NA(2))")),
                        public_bus=parse_bool(row.get("Public Bus Service (Status A(1)/NA(2))")),
                        atm=parse_bool(row.get("ATM (Status A(1)/NA(2))")),
                        has_hospital=parse_bool(row.get("Has_Hospital"))
                    )
                    db.add(infra)
                    infrastructure_inserted += 1
                    
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        if close_session_at_end:
            db.close()
            
    return {
        "districts_inserted": districts_inserted,
        "demographics_inserted": demographics_inserted,
        "infrastructure_inserted": infrastructure_inserted
    }

def main():
    print("Seeding database with Howrah civic dataset...")
    results = seed_database()
    print("\nSeed Results:")
    print(f"Districts inserted: {results['districts_inserted']}")
    print(f"Demographics inserted: {results['demographics_inserted']}")
    print(f"Infrastructure inserted: {results['infrastructure_inserted']}")

if __name__ == "__main__":
    main()
