from django.contrib import admin
from .models import Doctor

class DoctorAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "phone", "specialization", "hospital")  # remove 'created_at'

admin.site.register(Doctor, DoctorAdmin)
