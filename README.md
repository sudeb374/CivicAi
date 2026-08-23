# 🏛️ CivicAI - AI for Digital Public Infrastructure & Governance

Governments across India struggle to consolidate citizen feedback and align it with national infrastructure priorities. **CivicAI** is a scalable, multilingual AI platform designed as a Digital Public Good. It aggregates citizen development requests via voice and text across diverse linguistic regions, surfacing demand hotspots and recommending high-priority development projects to national policymakers.

---

## ✨ Key Features

1. **🎙️ Multilingual Grievance Portal**
   - Citizens can submit complaints in their native language (e.g., Bengali, Hindi, English) using text or **voice recording**.
   - The platform uses the Google Gemini AI API to instantly translate, categorize, and prioritize the complaint.

2. **📊 Real-time Government Dashboard**
   - A stunning, glassmorphism-inspired React dashboard tailored for government officials.
   - Tracks infrastructure gaps, citizen request volumes over time, and demographic data across hundreds of villages.

3. **🔥 Demand Hotspots Engine**
   - An intelligent backend service that aggregates incoming complaints by geographical location and sector (e.g., water, education, roads) to identify urgent infrastructure "hotspots".

4. **🤖 AI-Driven Policy Recommendations**
   - CivicAI actively queries Gemini 2.5 Flash to generate actionable, strategic policy advice based on real-time hotspot data, guiding national infrastructure investments.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS (v4) with custom keyframe animations and glassmorphism styling
- Recharts for data visualization
- Lucide React for iconography

**Backend:**
- Python 3 / FastAPI
- SQLite (SQLAlchemy ORM) for lightweight, robust data storage
- Google Generative AI (`gemini-2.5-flash`) for NLP and translation
- Pandas for infrastructure data processing

---

## 🚀 Setup & Installation

Follow these steps to run the CivicAI prototype on your local machine.

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- A Google Gemini API Key

### 2. Backend Setup
Navigate to the backend folder, set up your environment, and start the FastAPI server.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the root directory (or in `backend/`) and add your Gemini Key:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

**Seed the Database & Run Server:**
```bash
# Optional: Seed the database with realistic sample complaints
python scripts/seed_complaints.py

# Start the backend server
uvicorn main:app --reload --port 8000
```
The API will be available at `http://127.0.0.1:8000`.

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend folder, and start the Vite dev server.

```bash
cd frontend
npm install
npm run dev
```
The React dashboard will be available at `http://localhost:5173`.

---

## 🏗️ Project Architecture & Data Flow

1. **Citizen Input:** A user submits a complaint via the React frontend (`VoiceComplaints.jsx`).
2. **AI Processing:** The FastAPI backend receives the request and sends it to the `ai_service`. Gemini translates the text to English, assigns a severity score (0-100), and categorizes it (e.g., "Water", "Roads").
3. **Storage:** The structured data is saved to the SQLite `complaints` table.
4. **Aggregation:** The `hotspot_service` routinely scans the database to group complaints by village, surfacing the most critical areas.
5. **Government Insights:** The frontend fetches these hotspots and displays them to officials. The `recommendation_service` generates bespoke AI advice for solving the top hotspots.

---

*Built with ❤️ for the AI for Digital Public Infrastructure Hackathon.*
