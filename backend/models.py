from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database import Base

class District(Base):
    __tablename__ = "districts"
    
    id = Column(String, primary_key=True, index=True) # "341"
    state_code = Column(String, index=True)           # "19"
    name = Column(String)                             # "Howrah"
    
    demographics = relationship("Demographic", back_populates="district")

class Demographic(Base):
    __tablename__ = "demographics"
    
    village_code = Column(String, primary_key=True, index=True)
    district_id = Column(String, ForeignKey("districts.id"))
    subdistt = Column(String)
    village_name = Column(String)
    
    tot_p = Column(Integer)
    no_hh = Column(Integer)
    tot_m = Column(Integer)
    tot_f = Column(Integer)
    p_lit = Column(Integer)
    p_ill = Column(Integer)
    tot_work_p = Column(Integer)
    
    district = relationship("District", back_populates="demographics")
    infrastructure = relationship("Infrastructure", back_populates="demographic", uselist=False)
    citizen_requests = relationship("CitizenRequest", back_populates="demographic")

class Infrastructure(Base):
    __tablename__ = "infrastructure"
    
    village_code = Column(String, ForeignKey("demographics.village_code"), primary_key=True)
    
    tap_water_treated = Column(Boolean)
    power_supply = Column(Boolean)
    govt_primary_school = Column(Boolean)
    govt_secondary_school = Column(Boolean)
    pucca_road = Column(Boolean)
    public_bus = Column(Boolean)
    atm = Column(Boolean)
    has_hospital = Column(Boolean)
    
    demographic = relationship("Demographic", back_populates="infrastructure")

class CitizenRequest(Base):
    __tablename__ = "citizen_requests"

    id = Column(Integer, primary_key=True, index=True)
    village_code = Column(String, ForeignKey("demographics.village_code"), nullable=True, index=True)
    
    original_text = Column(String, nullable=False)
    language = Column(String, index=True)
    category = Column(String, index=True)
    urgency = Column(String)
    summary = Column(String)
    state = Column(String, index=True)
    district = Column(String, index=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    priority_score = Column(Float, default=0.0)
    priority_level = Column(String, default="Low")
    status = Column(String, default="received")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    demographic = relationship("Demographic", back_populates="citizen_requests")

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    
    original_text = Column(String, nullable=False)
    detected_language = Column(String, index=True)
    translated_text = Column(String, nullable=True)
    
    sector = Column(String, index=True)
    category = Column(String, index=True)
    
    village_code = Column(String, ForeignKey("demographics.village_code"), nullable=True, index=True)
    village = Column(String, nullable=True) # Text extracted by AI
    
    urgency = Column(String)
    severity = Column(String)
    
    priority_score = Column(Float, default=0.0)
    priority_level = Column(String, default="Low")
    status = Column(String, default="received")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    demographic = relationship("Demographic")
