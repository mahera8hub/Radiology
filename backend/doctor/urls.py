from django.urls import path
from .views import doctor_signup, doctor_login

urlpatterns = [
    path('signup/', doctor_signup, name='doctor_signup'),
    path('login/', doctor_login, name='doctor_login'),
]
