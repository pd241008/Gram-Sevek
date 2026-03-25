from app.services.prediction_service import PredictionService

def on_startup():
    print("API Gateway Started")
    PredictionService.load_models()
