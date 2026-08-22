from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.database import engine, Base, get_db
from backend.models import CitizenRequest, District, Demographic, Infrastructure
from backend import schemas
from backend.services.ai_service import analyze_complaint
from backend.services.priority_engine import calculate_priority_score, get_priority_level
from backend.services.analytics_service import get_dashboard_analytics
from backend.services.hotspot_service import get_hotspots
from backend.services.recommendation_service import get_recommendations
from backend.config import settings

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "CivicAI API"}

@app.post("/api/analyze", response_model=schemas.RequestAnalyzeOutput)
def analyze(input_data: schemas.RequestAnalyzeInput):
    try:
        result = analyze_complaint(input_data.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/requests", response_model=schemas.CitizenRequestResponse)
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

@app.get("/api/requests", response_model=List[schemas.CitizenRequestDetail])
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

@app.get("/api/analytics/dashboard", response_model=schemas.DashboardAnalytics)
def dashboard(db: Session = Depends(get_db)):
    try:
        return get_dashboard_analytics(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/hotspots", response_model=List[schemas.HotspotResponse])
def hotspots(db: Session = Depends(get_db)):
    try:
        return get_hotspots(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/recommendations", response_model=List[schemas.RecommendationResponse])
def recommendations(db: Session = Depends(get_db)):
    try:
        return get_recommendations(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/districts", response_model=List[schemas.DistrictSchema])
def get_all_districts(db: Session = Depends(get_db)):
    try:
        return db.query(District).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/demographics", response_model=List[schemas.DemographicSchema])
def get_all_demographics(district_id: Optional[str] = None, limit: int = Query(100, ge=1, le=1000), db: Session = Depends(get_db)):
    try:
        query = db.query(Demographic)
        if district_id:
            query = query.filter(Demographic.district_id == district_id)
        return query.limit(limit).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/infrastructure", response_model=List[schemas.InfrastructureSchema])
def get_all_infrastructure(limit: int = Query(100, ge=1, le=1000), db: Session = Depends(get_db)):
    try:
        return db.query(Infrastructure).limit(limit).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
