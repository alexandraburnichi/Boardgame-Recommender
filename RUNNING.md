# How to Run Boardgame Recommender

## 1. Prerequisites
- Python 3.10+
- Node.js & npm

## 2. Backend Setup
Open a terminal in the project root (`Boardgame-Recommender`).
(this must be run in venv)

```powershell
# Activate venv (Windows)
# Assuming venv is in the parent folder (..\venv)
..\venv\Scripts\Activate.ps1

# Install dependencies (first time only)
pip install -r backend/requirements.txt

# Run Server (IMPORTANT: Run from inside the backend folder!)
cd backend
uvicorn main:app --reload
```
Server runs at: `http://localhost:8000`

> **Troubleshooting:**
> If you see `ModuleNotFoundError: No module named 'backend'`, ensure you are inside the `backend/` folder and running `uvicorn main:app --reload`, NOT `uvicorn backend.main:app`.

## 3. Frontend Setup
Open a **new** terminal in the `frontend` folder.

```powershell
cd frontend

# Install dependencies (first time only)
npm install

# Run UI
npm run dev
```
App runs at: `http://localhost:5173`
