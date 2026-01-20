from app.services.nlp_service.service import run_nlp_pipeline

def process_text(payload: dict):
    text = payload.get("text", "")
    if not text:
        return {"error": "Text is required"}
    return run_nlp_pipeline(text)
