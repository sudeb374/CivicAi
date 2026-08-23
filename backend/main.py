from fastapi import FastAPI, APIRouter, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os

from backend.database import engine, Base, get_db
from backend.models import CitizenRequest, District, Demographic, Infrastructure, Complaint
from backend import schemas
from backend.services.ai_service import analyze_complaint, analyze_complaint_v2
from backend.services.priority_engine import calculate_priority_score, get_priority_level
from backend.services.analytics_service import get_dashboard_analytics
from backend.services.hotspot_service import get_hotspots
from backend.services.recommendation_service import get_recommendations
from backend.config import settings
from backend.scripts.seed_db import seed_database

# Create DB tables and seed real data if database is new/empty
Base.metadata.create_all(bind=engine)
try:
    seed_database()
except Exception as e:
    print(f"Warning: Database auto-seed encountered an issue: {e}")

app = FastAPI(title=settings.PROJECT_NAME)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter()

@api_router.get("/health")
def health_check():
    return {"status": "ok", "service": "CivicAI API"}

@api_router.post("/analyze", response_model=schemas.RequestAnalyzeOutput)
def analyze(input_data: schemas.RequestAnalyzeInput):
    try:
        result = analyze_complaint(input_data.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/requests", response_model=schemas.CitizenRequestResponse)
def create_request(request_data: schemas.CitizenRequestCreate, db: Session = Depends(get_db)):
    try:
        # Calculate priority
        data_dict = request_data.model_dump()
        score = calculate_priority_score(db, data_dict)
        level = get_priority_level(score)
        
        # Save to DB
        db_request = CitizenRequest(
            original_text=request_data.text,
            language=request_data.language,
            category=request_data.category,
            urgency=request_data.urgency,
            summary=request_data.summary,
            state=request_data.state,
            district=request_data.district,
            latitude=request_data.latitude,
            longitude=request_data.longitude,
            priority_score=score,
            priority_level=level
        )
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        
        return db_request
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/requests", response_model=List[schemas.CitizenRequestDetail])
def get_requests(
    state: Optional[str] = None,
    district: Optional[str] = None,
    category: Optional[str] = None,
    priority_level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CitizenRequest)
    
    if state:
        query = query.filter(CitizenRequest.state == state)
    if district:
        query = query.filter(CitizenRequest.district == district)
    if category:
        query = query.filter(CitizenRequest.category == category)
    if priority_level:
        query = query.filter(CitizenRequest.priority_level == priority_level)
        
    return query.all()

@api_router.get("/analytics/dashboard", response_model=schemas.DashboardAnalytics)
def dashboard(db: Session = Depends(get_db)):
    try:
        return get_dashboard_analytics(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/hotspots", response_model=List[schemas.HotspotResponse])
def hotspots(db: Session = Depends(get_db)):
    try:
        return get_hotspots(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/recommendations", response_model=List[schemas.RecommendationResponse])
def recommendations(db: Session = Depends(get_db)):
    try:
        return get_recommendations(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/districts", response_model=List[schemas.DistrictSchema])
def get_all_districts(db: Session = Depends(get_db)):
    try:
        return db.query(District).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/demographics", response_model=List[schemas.DemographicSchema])
def get_all_demographics(district_id: Optional[str] = None, limit: int = Query(1000, ge=1, le=2000), db: Session = Depends(get_db)):
    try:
        query = db.query(Demographic)
        if district_id:
            query = query.filter(Demographic.district_id == district_id)
        return query.limit(limit).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/infrastructure", response_model=List[schemas.InfrastructureSchema])
def get_all_infrastructure(limit: int = Query(1000, ge=1, le=2000), db: Session = Depends(get_db)):
    try:
        return db.query(Infrastructure).limit(limit).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================================================================
# Citizen Complaint and Decision-Support Endpoints
# =========================================================================

@api_router.post("/complaints", response_model=schemas.ComplaintResponse)
def create_complaint(request_data: schemas.ComplaintCreate, db: Session = Depends(get_db)):
    try:
        # 1. AI Analysis
        ai_result = analyze_complaint_v2(request_data.text)
        
        # 2. Location Mapping
        village_name = request_data.location or ai_result.get("location")
        village_code = None
        district = None
        
        if village_name:
            demo = db.query(Demographic).filter(Demographic.village_name.ilike(village_name)).first()
            if demo:
                village_code = demo.village_code
                district = demo.district_id
        
        # 3. Calculate priority score
        score_data = {
            "village_code": village_code,
            "category": ai_result.get("category"),
            "urgency": ai_result.get("urgency"),
            "district": district
        }
        score = calculate_priority_score(db, score_data)
        level = get_priority_level(score)
        
        # 4. Save Complaint
        db_complaint = Complaint(
            original_text=request_data.text,
            detected_language=ai_result.get("language"),
            translated_text=ai_result.get("translated_text"),
            sector=ai_result.get("sector"),
            category=ai_result.get("category"),
            village=village_name,
            village_code=village_code,
            urgency=ai_result.get("urgency"),
            severity=ai_result.get("severity"),
            priority_score=score,
            priority_level=level,
            status="received"
        )
        db.add(db_complaint)
        db.commit()
        db.refresh(db_complaint)
        
        return db_complaint
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/complaints", response_model=List[schemas.ComplaintResponse])
def get_complaints(
    sector: Optional[str] = None,
    priority_level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Complaint)
    if sector:
        query = query.filter(Complaint.sector == sector)
    if priority_level:
        query = query.filter(Complaint.priority_level == priority_level)
    return query.order_by(Complaint.created_at.desc()).all()

@api_router.get("/complaints/{id}", response_model=schemas.ComplaintResponse)
def get_complaint(id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

@api_router.get("/priority-issues", response_model=List[schemas.PriorityIssueResponse])
def get_priority_issues(db: Session = Depends(get_db)):
    issues = db.query(Complaint).filter(Complaint.priority_score >= 50).order_by(Complaint.priority_score.desc()).limit(20).all()
    return issues

@api_router.get("/demand-hotspots")
def get_demand_hotspots(db: Session = Depends(get_db)):
    from sqlalchemy import func
    hotspots = db.query(
        Complaint.village,
        Complaint.sector,
        func.count(Complaint.id).label('request_count'),
        func.avg(Complaint.priority_score).label('avg_score')
    ).group_by(Complaint.village, Complaint.sector).order_by(func.count(Complaint.id).desc()).limit(10).all()
    
    return [
        {
            "village": h.village or "Unknown",
            "sector": h.sector,
            "request_count": h.request_count,
            "average_priority_score": round(h.avg_score, 2)
        }
        for h in hotspots
    ]

@api_router.get("/government-insights", response_model=schemas.GovernmentInsightsResponse)
def get_government_insights(db: Session = Depends(get_db)):
    total = db.query(Complaint).count()
    if total == 0:
        return schemas.GovernmentInsightsResponse(
            total_complaints=0,
            resolved_complaints=0,
            sector_distribution={},
            urgency_distribution={},
            average_priority_score=0.0
        )
        
    resolved = db.query(Complaint).filter(Complaint.status == "resolved").count()
    
    from sqlalchemy import func
    sector_dist = db.query(Complaint.sector, func.count(Complaint.id)).group_by(Complaint.sector).all()
    urgency_dist = db.query(Complaint.urgency, func.count(Complaint.id)).group_by(Complaint.urgency).all()
    avg_score = db.query(func.avg(Complaint.priority_score)).scalar() or 0.0
    
    return schemas.GovernmentInsightsResponse(
        total_complaints=total,
        resolved_complaints=resolved,
        sector_distribution={s[0] or "Unknown": s[1] for s in sector_dist},
        urgency_distribution={u[0] or "Unknown": u[1] for u in urgency_dist},
        average_priority_score=round(avg_score, 2)
    )

@api_router.get("/ai-analysis", response_model=schemas.AIAnalysisStats)
def get_ai_analysis_stats(db: Session = Depends(get_db)):
    total = db.query(Complaint).count()
    if total == 0:
        return schemas.AIAnalysisStats(
            total_analyzed=0,
            language_distribution={},
            sector_distribution={},
            common_categories={},
            severity_distribution={}
        )
        
    from sqlalchemy import func
    lang_dist = db.query(Complaint.detected_language, func.count(Complaint.id)).group_by(Complaint.detected_language).all()
    sector_dist = db.query(Complaint.sector, func.count(Complaint.id)).group_by(Complaint.sector).all()
    cat_dist = db.query(Complaint.category, func.count(Complaint.id)).group_by(Complaint.category).order_by(func.count(Complaint.id).desc()).limit(10).all()
    sev_dist = db.query(Complaint.severity, func.count(Complaint.id)).group_by(Complaint.severity).all()
    
    return schemas.AIAnalysisStats(
        total_analyzed=total,
        language_distribution={x[0] or "Unknown": x[1] for x in lang_dist},
        sector_distribution={x[0] or "Unknown": x[1] for x in sector_dist},
        common_categories={x[0] or "Unknown": x[1] for x in cat_dist},
        severity_distribution={x[0] or "Unknown": x[1] for x in sev_dist}
    )

# Include both /api and root paths for all API endpoints so all routing styles work
app.include_router(api_router, prefix="/api")
app.include_router(api_router)

# =========================================================================
# Serve Frontend
# =========================================================================

frontend_dist = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "dist")

if os.path.isdir(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{catchall:path}")
    def serve_frontend(catchall: str):
        file_path = os.path.join(frontend_dist, catchall)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(frontend_dist, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
        return {"status": "ok", "service": "CivicAI API"}
