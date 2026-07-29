# SupplySync AI Orchestrator

The orchestrator serves as the central hub of the SupplySync AI Multi-Agent Logistics Platform. It acts as the primary application that coordinates the workflows between drivers, shippers, and the 8 underlying intelligent AI agents.

## Phase 1 Overview
This phase establishes the foundational architecture for the orchestrator, including:
- A React + Vite frontend application.
- A FastAPI backend application.
- Initial project scaffolding and routing.
- Authentication endpoints (placeholders for Driver/Shipper registration and login).
- Agent Registry for tracking the multi-agent ecosystem.

## Frontend
Located in the `frontend` directory.
- Built with React, Vite, and React Router.
- Uses Lucide React icons.
- Styled using a customized CSS theme for a professional logistics platform.

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

## Backend
Located in the `backend` directory.
- Built with FastAPI.
- Configured with placeholders for MongoDB and JWT authentication.
- Includes a registry for all 8 underlying AI agents.

### Running the Backend
```bash
cd backend
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On Unix
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
