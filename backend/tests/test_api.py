import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database import Base, engine, SessionLocal
from backend.models import CitizenRequest

# Setup test DB
Base.metadata.create_all(bind=engine)
client = TestClient(app)

@pytest.fixture(scope="module")
def setup_db():
    db = SessionLocal()
    # Add a mock request
    req = CitizenRequest(
        original_text="There is a pothole on MG Road.",
        language="en",
        category="roads",
        urgency="medium",
        summary="Pothole issue on MG Road",
        state="West Bengal",
        district="Kolkata",
        priority_score=65.5,
        priority_level="Medium"
    )
    db.add(req)
    db.commit()
    yield
    db.query(CitizenRequest).delete()
    db.commit()
    db.close()

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "CivicAI API"}

def test_analyze_demo_mode():
    response = client.post("/api/analyze", json={"text": "Road is very bad in my area, please fix it urgent."})
    assert response.status_code == 200
    data = response.json()
    assert data["category"] == "roads"
    assert data["urgency"] == "high"
    # Even if API is configured, mock or fallback can be used, but since we didn't mock gemini,
    # it might hit API if key is there. We check for existence of 'category'.

def test_create_request():
    payload = {
        "text": "Need internet connection in the school",
        "language": "en",
        "category": "education",
        "urgency": "medium",
        "summary": "Need internet",
        "state": "Maharashtra",
        "district": "Pune"
    }
    response = client.post("/api/requests", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "priority_score" in data
    assert "priority_level" in data

def test_get_requests(setup_db):
    response = client.get("/api/requests?district=Kolkata")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["district"] == "Kolkata"

def test_dashboard_analytics(setup_db):
    response = client.get("/api/analytics/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "total_requests" in data
    assert "category_counts" in data

def test_hotspots_and_recommendations(setup_db):
    res_hotspots = client.get("/api/hotspots")
    assert res_hotspots.status_code == 200
    assert isinstance(res_hotspots.json(), list)

    res_recs = client.get("/api/recommendations")
    assert res_recs.status_code == 200
    assert isinstance(res_recs.json(), list)

def test_get_districts(setup_db):
    response = client.get("/api/districts")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_demographics(setup_db):
    response = client.get("/api/demographics")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if data:
        assert "village_code" in data[0]
        assert "tot_p" in data[0]

def test_get_infrastructure(setup_db):
    response = client.get("/api/infrastructure")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if data:
        assert "village_code" in data[0]
        assert "has_hospital" in data[0]
