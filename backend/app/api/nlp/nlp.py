from fastapi import APIRouter
from app.controllers.nlp_controller import process_text

router = APIRouter()

@router.post("/process")
def nlp(payload: dict):
    return process_text(payload)
