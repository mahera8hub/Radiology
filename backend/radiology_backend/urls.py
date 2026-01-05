# from django.contrib import admin
# from django.urls import path, include
# from api.views import home

# urlpatterns = [
#      path('', home),
#     path('admin/', admin.site.urls),
#     path('api/', include('api.urls')),
#     path("api/doctor/", include("doctor.urls")),
#     #  path('api/patient/', include('patient.urls')),   # patient app API
#     path('api/contact/', include('contact.urls')), 
#     # path("api/doctor/", include("doctor.urls")),
# ]




from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path("api/doctor/", include("doctor.urls")),
    #  path('api/patient/', include('patient.urls')),   # patient app API
    path('api/contact/', include('contact.urls')), 
    # path("api/doctor/", include("doctor.urls")),
]
