from sqlalchemy.orm import Session
from backend.models import CitizenRequest
from sqlalchemy import func

def get_dashboard_analytics(db: Session) -> dict:
    total = db.query(CitizenRequest).count()
    critical = db.query(CitizenRequest).filter(CitizenRequest.priority_level == "Critical").count()
    high = db.query(CitizenRequest).filter(CitizenRequest.priority_level == "High").count()
    
    # Category counts
    cat_counts = db.query(CitizenRequest.category, func.count(CitizenRequest.id)).group_by(CitizenRequest.category).all()
    cat_dict = {c[0]: c[1] for c in cat_counts if c[0]}
    
    # State counts
    state_counts = db.query(CitizenRequest.state, func.count(CitizenRequest.id)).group_by(CitizenRequest.state).all()
    state_dict = {c[0]: c[1] for c in state_counts if c[0]}
    
    # District counts
    dist_counts = db.query(CitizenRequest.district, func.count(CitizenRequest.id)).group_by(CitizenRequest.district).all()
    dist_dict = {c[0]: c[1] for c in dist_counts if c[0]}
    
    return {
        "total_requests": total,
        "critical_requests": critical,
        "high_priority_requests": high,
        "category_counts": cat_dict,
        "state_counts": state_dict,
        "district_counts": dist_dict
    }
