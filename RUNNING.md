# How to Run Boardgame Recommender

## 1. Prerequisites
- Python 3.10+
- Node.js & npm

## 2. Backend Setup
Open a terminal in the root folder (`Boardgame-Recommender`).

```powershell
# Create virtual environment (first time only)
python -m venv venv

# Activate venv (Windows)
.\venv\Scripts\activate

# Install dependencies (first time only)
pip install -r backend/requirements.txt

# Run Server (important: run from backend folder)
cd backend
uvicorn main:app --reload
```
Server runs at: `http://localhost:Whatever port the server uses`

## 3. Frontend Setup
Open a **new** terminal in the root folder.

```powershell
cd frontend

# Install dependencies (first time only)
npm install

# Run UI
npm run dev
```
App runs at: `http://localhost:Whatever port the frontend uses`
