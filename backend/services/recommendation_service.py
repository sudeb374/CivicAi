from sqlalchemy.orm import Session
from backend.services.hotspot_service import get_hotspots
from backend.services.priority_engine import get_priority_level

def get_recommendations(db: Session) -> list:
    hotspots = get_hotspots(db)
    
    recommendations = []
    for h in hotspots:
        if h["priority_score"] >= 70:
            rec = {
                "district": h["district"],
                "category": h["category"],
                "priority_score": h["priority_score"],
                "priority_level": get_priority_level(h["priority_score"]),
                "reason": f"High citizen demand ({h['request_count']} requests) and infrastructure gap in {h['category']}.",
                "recommended_action": f"Prioritize {h['category']} infrastructure development in {h['district']}."
            }
            recommendations.append(rec)
            
    return recommendations
