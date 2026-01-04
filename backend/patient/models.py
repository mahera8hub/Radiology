# # patient/models.py
# from django.db import models
# from doctor.models import Doctor

# class PatientHistory(models.Model):
#     doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='patient_histories')
#     patient_name = models.CharField(max_length=100)
#     age = models.IntegerField()
#     diagnosis = models.TextField()
#     date = models.DateField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.patient_name} - {self.doctor.name}"




from django.db import models

class Patient(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.name

class PatientHistory(models.Model):
    doctor = models.ForeignKey("doctor.Doctor", on_delete=models.CASCADE, related_name='patient_histories')
    patient_name = models.CharField(max_length=100)
    age = models.IntegerField()
    diagnosis = models.TextField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient_name} - {self.doctor.name}"
