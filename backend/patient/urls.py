from django.urls import path
from doctor.views import DoctorHistoryView

urlpatterns = [
    path('<int:doctor_id>/history/', DoctorHistoryView.as_view(), name='doctor-history'),
]
