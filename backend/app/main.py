from fastapi import FastAPI

app = FastAPI(title="U Can AI - Pilot MVP")

@app.get("/health")
async def health():
    return {"status": "ok"}
