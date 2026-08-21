# from xml.etree.ElementInclude import include

# from django.urls import path
# from .views import predict_tumor
# from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# urlpatterns = [
#     path('predict/', predict_tumor, name='predict_tumor'),
#     path('api/', include('api.urls')),
#     path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
#     path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
#     #  path("doctor/signup/", DoctorSignupView.as_view(), name="doctor-signup"),
# ]



from django.urls import path
from .views import predict_tumor

urlpatterns = [
    path('predict/', predict_tumor, name='predict_tumor'),
    #  path("doctor/signup/", DoctorSignupView.as_view(), name="doctor-signup"),
]