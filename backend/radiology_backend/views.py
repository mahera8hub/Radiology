from django.http import JsonResponse
from .ml_model import get_model

def predict(request):
    model = get_model()  # model loads here only
    # Example prediction
    # data = ... extract from request
    # result = model.predict(data)
    return JsonResponse({"status": "model loaded successfully"})
