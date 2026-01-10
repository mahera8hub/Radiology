from django.http import JsonResponse
from .ml_model import get_model

def predict(request):
    model = get_model()  # model loads here only
    # Example prediction
    # data = ... extract from request
    # result = model.predict(data)
    return JsonResponse({"status": "model loaded successfully"})

# from django.http import JsonResponse
# from django.conf import settings

# def predict(request):
#     if not settings.ENABLE_ML:
#         return JsonResponse(
#             {"status": "ML temporarily disabled"},
#             status=503
#         )

#     from .ml_model import get_model
#     model = get_model()

#     # your normal prediction code here
#     return JsonResponse({"status": "prediction success"})
