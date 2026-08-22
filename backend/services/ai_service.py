import google.generativeai as genai
import json
import logging
from backend.config import settings

logger = logging.getLogger(__name__)

if settings.GEMINI_API_KEY:
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
    except Exception as e:
        logger.error(f"Failed to configure Gemini: {e}")
        model = None
else:
    model = None

def _demo_mode_analyze(text: str) -> dict:
    # Deterministic rule-based demo
    text_lower = text.lower()
    
    # Detect language basic
    if any(c in text for c in ['অ', 'আ', 'ক', 'খ', 'গ']):
        language = "bn"
    elif any(c in text for c in ['अ', 'आ', 'क', 'ख', 'ग']):
        language = "hi"
    else:
        language = "en"
        
    # Detect category
    if "road" in text_lower or "pothole" in text_lower or "রাস্তা" in text_lower or "সড়ক" in text_lower:
        category = "roads"
    elif "water" in text_lower or "pipe" in text_lower or "জল" in text_lower or "পানি" in text_lower:
        category = "water"
    elif "health" in text_lower or "hospital" in text_lower or "হাসপাতাল" in text_lower:
        category = "healthcare"
    elif "light" in text_lower or "electric" in text_lower or "power" in text_lower:
        category = "electricity"
    else:
        category = "other"
        
    # Detect urgency
    if "urgent" in text_lower or "immediate" in text_lower or "জরুরী" in text_lower:
        urgency = "high"
    else:
        urgency = "medium"
        
    return {
        "language": language,
        "category": category,
        "urgency": urgency,
        "summary": text[:50] + "...",
        "confidence": 0.8,
        "demo_mode": True
    }

def analyze_complaint(text: str) -> dict:
    if not model:
        return _demo_mode_analyze(text)
        
    prompt = f"""
    Analyze the following citizen complaint and extract the details in valid JSON format.
    Do not include markdown tags like ```json, just output the raw JSON object.
    
    Complaint: "{text}"
    
    Required JSON structure:
    {{
      "language": "ISO 639-1 code (e.g., en, bn, hi)",
      "category": "one of: roads, healthcare, water, education, electricity, internet, transport, other",
      "urgency": "low, medium, high, or critical",
      "summary": "Short 1-sentence summary in English",
      "confidence": 0.95 (float between 0 and 1)
    }}
    """
    try:
        response = model.generate_content(prompt)
        # Parse JSON
        result_text = response.text.strip()
        if result_text.startswith("```json"):
            result_text = result_text[7:-3]
        elif result_text.startswith("```"):
            result_text = result_text[3:-3]
            
        data = json.loads(result_text)
        data["demo_mode"] = False
        
        # Ensure category is valid
        valid_categories = ["roads", "healthcare", "water", "education", "electricity", "internet", "transport", "other"]
        if data.get("category", "").lower() not in valid_categories:
            data["category"] = "other"
            
        return data
    except Exception as e:
        logger.error(f"Gemini API failed: {e}")
        return _demo_mode_analyze(text)
