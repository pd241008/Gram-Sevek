from fastapi import APIRouter
from . import health_router ,nlp_router

api_router = APIRouter()

api_router.include_router(health_router, prefix="/health", tags=["Health"])
api_router.include_router(nlp_router, prefix="/nlp", tags=["NLP"])
