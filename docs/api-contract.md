# CivicAI API Contract

This document defines the stable APIs exposed by the Backend for the Frontend integration.

## 1. Analyze Complaint
**METHOD:** `POST`
**ENDPOINT:** `/api/analyze`
**REQUEST:**
```json
{
  "text": "String - Citizen complaint text"
}
```
**RESPONSE:**
```json
{
  "language": "String",
  "category": "String",
  "urgency": "String",
  "summary": "String",
  "confidence": "Float",
  "demo_mode": "Boolean"
}
```
**ERROR RESPONSE:** HTTP 500 Internal Server Error

## 2. Create Citizen Request
**METHOD:** `POST`
**ENDPOINT:** `/api/requests`
**REQUEST:**
```json
{
  "text": "String",
  "language": "String",
  "category": "String",
  "urgency": "String",
  "summary": "String",
  "state": "String",
  "district": "String",
  "village_code": "String (Optional)",
  "latitude": "Float (Optional)",
  "longitude": "Float (Optional)"
}
```
**RESPONSE:**
```json
{
  "id": "Integer",
  "priority_score": "Float",
  "priority_level": "String",
  "status": "String"
}
```
**ERROR RESPONSE:** HTTP 500 Internal Server Error

## 3. Real Government Data APIs

### GET Districts
**METHOD:** `GET`
**ENDPOINT:** `/api/districts`
**REQUEST:** None
**RESPONSE:**
```json
[
  {
    "id": "String (District Code)",
    "state_code": "String",
    "name": "String"
  }
]
```

### GET Demographics
**METHOD:** `GET`
**ENDPOINT:** `/api/demographics`
**QUERY PARAMS:** `district_id` (Optional String), `limit` (Optional Int)
**RESPONSE:**
```json
[
  {
    "village_code": "String",
    "district_id": "String",
    "subdistt": "String",
    "village_name": "String",
    "tot_p": "Integer",
    "no_hh": "Integer",
    "tot_m": "Integer",
    "tot_f": "Integer",
    "p_lit": "Integer",
    "p_ill": "Integer",
    "tot_work_p": "Integer"
  }
]
```

### GET Infrastructure
**METHOD:** `GET`
**ENDPOINT:** `/api/infrastructure`
**QUERY PARAMS:** `limit` (Optional Int)
**RESPONSE:**
```json
[
  {
    "village_code": "String",
    "tap_water_treated": "Boolean",
    "power_supply": "Boolean",
    "govt_primary_school": "Boolean",
    "govt_secondary_school": "Boolean",
    "pucca_road": "Boolean",
    "public_bus": "Boolean",
    "atm": "Boolean",
    "has_hospital": "Boolean"
  }
]
```
