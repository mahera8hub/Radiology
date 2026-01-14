from django.http import JsonResponse
from django.urls import path
from .views import predict_tumor
def health(request):
    return JsonResponse({"status": "Backend alive"})

urlpatterns = [
    path("", health),               # 👈 root route
    path('predict/', predict_tumor, name='predict_tumor'),
    #  path("doctor/signup/", DoctorSignupView.as_view(), name="doctor-signup"),
]
