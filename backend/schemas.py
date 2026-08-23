from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict
from datetime import datetime

class RequestAnalyzeInput(BaseModel):
    text: str = Field(..., description="Citizen complaint text")

class RequestAnalyzeOutput(BaseModel):
    language: str
    category: str
    urgency: str
    summary: str
    confidence: float
    demo_mode: bool

class CitizenRequestCreate(BaseModel):
    text: str = Field(..., description="Original complaint text")
    language: str
    category: str
    urgency: str
    summary: str
    state: str
    district: str
    village_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class CitizenRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    priority_score: float
    priority_level: str
    status: str

class CitizenRequestDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    village_code: Optional[str]
    original_text: str
    language: str
    category: str
    urgency: str
    summary: str
    state: str
    district: str
    latitude: Optional[float]
    longitude: Optional[float]
    priority_score: float
    priority_level: str
    status: str
    created_at: datetime

class DashboardAnalytics(BaseModel):
    total_requests: int
    critical_requests: int
    high_priority_requests: int
    category_counts: Dict[str, int]
    state_counts: Dict[str, int]
    district_counts: Dict[str, int]

class HotspotResponse(BaseModel):
    district: str
    state: str
    latitude: float
    longitude: float
    category: str
    request_count: int
    priority_score: float

class RecommendationResponse(BaseModel):
    district: str
    category: str
    priority_score: float
    priority_level: str
    reason: str
    recommended_action: str

# New Data Models
class DistrictSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    state_code: str
    name: str

class DemographicSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    village_code: str
    district_id: str
    subdistt: str
    village_name: str
    tot_p: int
    no_hh: int
    tot_m: int
    tot_f: int
    p_lit: int
    p_ill: int
    tot_work_p: int

class InfrastructureSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    village_code: str
    tap_water_treated: Optional[bool]
    power_supply: Optional[bool]
    govt_primary_school: Optional[bool]
    govt_secondary_school: Optional[bool]
    pucca_road: Optional[bool]
    public_bus: Optional[bool]
    has_hospital: Optional[bool]

# Day 2 Schemas

class ComplaintCreate(BaseModel):
    text: str = Field(..., description="Raw citizen complaint text")
    location: Optional[str] = Field(None, description="Optional location provided by the citizen")

class ComplaintResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    original_text: str
    detected_language: Optional[str]
    translated_text: Optional[str]
    sector: Optional[str]
    category: Optional[str]
    village: Optional[str]
    village_code: Optional[str]
    urgency: Optional[str]
    severity: Optional[str]
    priority_score: float
    priority_level: str
    status: str
    created_at: datetime

class PriorityIssueResponse(BaseModel):
    id: int
    sector: Optional[str]
    category: Optional[str]
    village: Optional[str]
    priority_score: float
    priority_level: str
    summary: Optional[str]

class GovernmentInsightsResponse(BaseModel):
    total_complaints: int
    resolved_complaints: int
    sector_distribution: Dict[str, int]
    urgency_distribution: Dict[str, int]
    average_priority_score: float

class AIAnalysisStats(BaseModel):
    total_analyzed: int
    language_distribution: Dict[str, int]
    sector_distribution: Dict[str, int]
    common_categories: Dict[str, int]
    severity_distribution: Dict[str, int]
