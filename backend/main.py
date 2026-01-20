from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.api_router import api_router
from app.core.startup import on_startup
from app.core.shutdown import on_shutdown

app = FastAPI(
    title="Microservice API Gateway",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_event_handler("startup", on_startup)
app.add_event_handler("shutdown", on_shutdown)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {"status": "Gateway running"}
