# CivicAI Backend

This is the backend for the CivicAI platform, providing a FastAPI service to analyze and prioritize citizen development requests using AI.

## Python Environment Setup

1. Make sure you have Python 3.10+ installed.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

## Dependency Installation

1. Install requirements from the `backend/` directory:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. Create a `.env` file based on `.env.example` in the project root if you intend to use the Gemini API. (Without an API key, the system runs safely in DEMO mode).

## How to Start FastAPI

1. From the root directory, with the virtual environment activated, run:
   ```bash
   uvicorn backend.main:app --reload
   ```
2. The server will start at `http://127.0.0.1:8000`.

## API Documentation

- Interactive Swagger UI: `http://127.0.0.1:8000/docs`

## Health Endpoint

- `GET /api/health`
- Expected response: `{"status": "ok", "service": "CivicAI API"}`

## Test Command

1. From the root directory, run:
   ```bash
   PYTHONPATH=. pytest backend/tests/ -q
   ```
