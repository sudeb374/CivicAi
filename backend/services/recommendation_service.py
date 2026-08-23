from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.models import Complaint
from backend.services.priority_engine import get_priority_level
from backend.services.ai_service import generate_recommendation_text

def get_recommendations(db: Session) -> list:
    hotspots = db.query(
        Complaint.village,
        Complaint.sector,
        func.count(Complaint.id).label('request_count'),
        func.avg(Complaint.priority_score).label('avg_score')
    ).group_by(Complaint.village, Complaint.sector).order_by(func.count(Complaint.id).desc()).limit(3).all()
    
    recommendations = []
    for h in hotspots:
        reason, action = generate_recommendation_text(
            district=h.village or "Unknown",
            category=h.sector or "Unknown",
            request_count=h.request_count,
            priority_score=round(h.avg_score, 2)
        )
        rec = {
            "district": h.village or "Unknown",
            "category": h.sector or "Unknown",
            "priority_score": round(h.avg_score, 2),
            "priority_level": get_priority_level(h.avg_score),
            "reason": reason,
            "recommended_action": action
        }
        recommendations.append(rec)
            
    return recommendations
