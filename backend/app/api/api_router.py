from fastapi import APIRouter
from . import health_router ,nlp_router, login_router
from app.api.routes.predictions import prediction_router

api_router = APIRouter()

api_router.include_router(health_router, prefix="/health", tags=["Health"])
api_router.include_router(nlp_router, prefix="/nlp", tags=["NLP"])
api_router.include_router(login_router, prefix="/login", tags=["Login"])
api_router.include_router(prediction_router, prefix="/predictions", tags=["Predictions"])