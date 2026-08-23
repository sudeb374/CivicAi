import sys
import os
import random
from datetime import datetime, timedelta

# Add the parent directory to the path so we can import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.database import SessionLocal
from backend.models import Complaint, Demographic
from backend.services.priority_engine import calculate_priority_score, get_priority_level

def seed_complaints(num_complaints=50):
    db = SessionLocal()
    
    # Get all villages to randomly assign complaints
    villages = db.query(Demographic).all()
    if not villages:
        print("No villages found in DB. Run database seeding first.")
        db.close()
        return

    sectors = [
        "Roads", "Water", "Healthcare/Hospitals", 
        "Primary Education", "Secondary Education", 
        "Electricity", "Public Transport", "Financial/ATM"
    ]
    
    urgencies = ["low", "medium", "high", "critical"]
    severities = ["minor", "major", "severe"]
    
    templates = {
        "Roads": [
            ("The road near the market is full of potholes.", "en"),
            ("আমাদের গ্রামের রাস্তা খুব খারাপ", "bn"),
            ("सड़क पूरी तरह से टूट चुकी है", "hi"),
            ("Bridge connecting to the main highway is damaged.", "en")
        ],
        "Water": [
            ("No drinking water for 3 days.", "en"),
            ("পানীয় জলের পাইপ ফেটে গেছে", "bn"),
            ("पीने का पानी नहीं आ रहा है", "hi"),
            ("Water contamination in the local well.", "en")
        ],
        "Healthcare/Hospitals": [
            ("Hospital has no doctor on duty.", "en"),
            ("হাসপাতালে কোনো ডাক্তার নেই", "bn"),
            ("अस्पताल में दवाइयां नहीं हैं", "hi"),
            ("Ambulance service is not available.", "en")
        ],
        "Primary Education": [
            ("School roof is leaking.", "en"),
            ("প্রাইমারি স্কুলে শিক্ষকের অভাব", "bn"),
            ("प्राथमिक विद्यालय में शिक्षक नहीं आते", "hi")
        ],
        "Secondary Education": [
            ("No science teacher in high school.", "en"),
            ("হাইস্কুলে লাইব্রেরি নেই", "bn")
        ],
        "Electricity": [
            ("Power cut for last 48 hours.", "en"),
            ("দুই দিন ধরে কারেন্ট নেই", "bn"),
            ("बिजली के तार टूट गए हैं", "hi")
        ],
        "Public Transport": [
            ("No bus service after 6 PM.", "en"),
            ("বাস পরিষেবা খুব খারাপ", "bn")
        ],
        "Financial/ATM": [
            ("ATM is out of cash for a week.", "en"),
            ("এটিএম মেশিনে টাকা নেই", "bn")
        ]
    }
    
    print(f"Seeding {num_complaints} complaints...")
    
    # We want a distribution over the last 6 months
    now = datetime.utcnow()
    start_date = now - timedelta(days=180)
    
    for i in range(num_complaints):
        village = random.choice(villages)
        sector = random.choice(sectors)
        template, lang = random.choice(templates[sector])
        
        urgency = random.choice(urgencies)
        severity = random.choice(severities)
        
        # Calculate priority
        score_data = {
            "village_code": village.village_code,
            "category": sector.lower().split('/')[0],
            "urgency": urgency,
            "district": village.district_id
        }
        score = calculate_priority_score(db, score_data)
        level = get_priority_level(score)
        
        # Generate random date
        random_days = random.randint(0, 180)
        random_date = start_date + timedelta(days=random_days)
        
        complaint = Complaint(
            original_text=template,
            detected_language=lang,
            translated_text=f"Translated: {template}" if lang != "en" else None,
            sector=sector,
            category=sector.lower().split('/')[0],
            village=village.village_name,
            village_code=village.village_code,
            urgency=urgency,
            severity=severity,
            priority_score=score,
            priority_level=level,
            status=random.choice(["received", "pending", "resolved"]),
            created_at=random_date
        )
        db.add(complaint)
    
    try:
        db.commit()
        print("Successfully seeded complaints!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_complaints(50)
