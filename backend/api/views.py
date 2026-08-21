from django.http import JsonResponse
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
import requests

# ML service predict endpoint
ML_SERVICE_URL = "https://radiology-2.onrender.com/predict"

CLASS_NAMES = ["Glioma", "Meningioma", "No Tumor", "Pituitary"]


@extend_schema(
    description='Upload Brain MRI Image for prediction of Brain Tumor Type (Glioma, Meningioma, Pituitary, No Tumor)',
    request={
        'multipart/form-data': {
            'type': 'object',
            'properties': {
                'file': {
                    'type': 'string',
                    'format': 'binary',
                    'description': 'MRI image file (jpg/png)',
                },
            },
            'required': ['file'],
        }
    },
    responses=inline_serializer(
        name='PredictResponse',
        fields={
            'predicted_class': serializers.ChoiceField(choices=CLASS_NAMES),
            'confidence': serializers.FloatField(),
        },
    ),
)
@api_view(['POST'])
@parser_classes([MultiPartParser])
def predict_tumor(request):
    file = request.FILES.get("file")

    if not file:
        return JsonResponse(
            {"error": "No file uploaded"},
            status=400
        )

    try:
        response = requests.post(
            ML_SERVICE_URL,
            files={
                "file": (
                    file.name,
                    file.read(),
                    file.content_type or "application/octet-stream"
                )
            },
            timeout=60
        )

        response.raise_for_status()

        content_type = response.headers.get("content-type", "")
        if not content_type.startswith("application/json"):
            return JsonResponse(
                {
                    "error": "Invalid response from ML service",
                    "raw_response": response.text[:500]
                },
                status=502
            )

        return JsonResponse(response.json(), status=200)

    except requests.exceptions.Timeout:
        return JsonResponse(
            {"error": "ML service timeout"},
            status=504
        )

    except requests.exceptions.RequestException as e:
        return JsonResponse(
            {
                "error": "ML service unavailable",
                "details": str(e)
            },
            status=503
        )

    except ValueError:
        return JsonResponse(
            {"error": "Invalid JSON received from ML service"},
            status=502
        )