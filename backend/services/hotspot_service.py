from sqlalchemy.orm import Session
from backend.models import CitizenRequest
from sqlalchemy import func

def get_hotspots(db: Session) -> list:
    # Group by district and category to find hot spots
    hotspots = db.query(
        CitizenRequest.district,
        CitizenRequest.state,
        CitizenRequest.category,
        func.count(CitizenRequest.id).label("request_count"),
        func.max(CitizenRequest.latitude).label("latitude"),
        func.max(CitizenRequest.longitude).label("longitude"),
        func.avg(CitizenRequest.priority_score).label("priority_score")
    ).group_by(
        CitizenRequest.district,
        CitizenRequest.state,
        CitizenRequest.category
    ).having(func.count(CitizenRequest.id) > 0).all()
    
    result = []
    for h in hotspots:
        result.append({
            "district": h.district or "Unknown",
            "state": h.state or "Unknown",
            "latitude": h.latitude or 0.0,
            "longitude": h.longitude or 0.0,
            "category": h.category,
            "request_count": h.request_count,
            "priority_score": round(h.priority_score, 2)
        })
    
    # Sort by priority score descending
    result.sort(key=lambda x: x["priority_score"], reverse=True)
    return result
