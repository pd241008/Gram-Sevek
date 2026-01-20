from fastapi import APIRouter
from app.api.v1.routes.health import router as health_router
from app.api.v1.routes.nlp import router as nlp_router

api_router = APIRouter()

api_router.include_router(health_router, prefix="/health", tags=["Health"])
api_router.include_router(nlp_router, prefix="/nlp", tags=["NLP"])
