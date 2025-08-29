Backend for U Can AI pilot MVP - FastAPI + SQLModel

Structure:
- app/
  - api/       -> routers
  - core/      -> config, settings
  - models/    -> DB models
  - schemas/   -> Pydantic schemas
  - services/  -> LLM middleware, prompt builder
  - workers/   -> background job workers

Quick start (dev):
- python -m venv .venv
- source .venv/bin/activate
- pip install -r requirements.txt
- uvicorn app.main:app --reload
