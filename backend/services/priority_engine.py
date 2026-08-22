from sqlalchemy.orm import Session
from backend.models import CitizenRequest, Demographic, Infrastructure

def compute_priority(citizen_demand: float, infrastructure_gap: float, population_impact: float, urgency: float) -> float:
    """
    Calculates the final priority score based on the CivicAI formula.
    All inputs must be between 0 and 100.
    """
    # Enforce 0-100 bounds
    citizen_demand = max(0.0, min(citizen_demand, 100.0))
    infrastructure_gap = max(0.0, min(infrastructure_gap, 100.0))
    population_impact = max(0.0, min(population_impact, 100.0))
    urgency = max(0.0, min(urgency, 100.0))
    
    score = (0.40 * citizen_demand) + (0.30 * infrastructure_gap) + (0.20 * population_impact) + (0.10 * urgency)
    return round(score, 2)

def calculate_priority_score(db: Session, request_data: dict) -> float:
    village_code = request_data.get("village_code")
    district = request_data.get("district")
    category = request_data.get("category")
    urgency_text = request_data.get("urgency", "medium").lower()

    # 1. Urgency (0-100)
    urgency_map = {"low": 25, "medium": 50, "high": 75, "critical": 100}
    urgency = urgency_map.get(urgency_text, 50)
    
    # Defaults
    infrastructure_gap = 50.0
    population_impact = 50.0

    if db and village_code:
        # 2. Population Impact (0-100)
        demo = db.query(Demographic).filter(Demographic.village_code == village_code).first()
        if demo:
            pop = demo.tot_p
            # Normalize against a 10,000 population cap (common large village size)
            population_impact = min((pop / 10000.0) * 100.0, 100.0)
            
        # 3. Infrastructure Gap (0-100)
        infra = db.query(Infrastructure).filter(Infrastructure.village_code == village_code).first()
        if infra:
            # We want to measure the GAP. Missing infrastructure = HIGHER gap score.
            # Available infrastructure = True. Missing = False or None.
            fields = [
                infra.tap_water_treated,
                infra.power_supply,
                infra.govt_primary_school,
                infra.govt_secondary_school,
                infra.pucca_road,
                infra.public_bus,
                infra.atm,
                infra.has_hospital
            ]
            
            # Count how many are MISSING (False or None)
            missing_count = sum(1 for f in fields if not f)
            
            # Score = (missing_count / total_fields) * 100
            infrastructure_gap = (missing_count / len(fields)) * 100.0

    # 4. Citizen Demand (0-100)
    citizen_demand = 10.0
    if db and district and category:
        count = db.query(CitizenRequest).filter(
            CitizenRequest.district == district,
            CitizenRequest.category == category
        ).count()
        # Cap count normalization to 100 points (e.g., 20 complaints = 100 pts)
        citizen_demand = min((count / 20.0) * 100.0, 100.0)

    # Calculate final score
    return compute_priority(
        citizen_demand=citizen_demand,
        infrastructure_gap=infrastructure_gap,
        population_impact=population_impact,
        urgency=urgency
    )

def get_priority_level(score: float) -> str:
    """
    Converts a priority score (0-100) to a priority level category.
    """
    if score < 25:
        return "Low"
    elif score < 50:
        return "Medium"
    elif score < 75:
        return "High"
    else:
        return "Critical"
