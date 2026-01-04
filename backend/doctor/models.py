from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class DoctorManager(BaseUserManager):
    def create_user(self, email, name, phone, specialization, password=None, hospital=None):
        if not email:
            raise ValueError("Doctors must have an email address")
        email = self.normalize_email(email)
        doctor = self.model(
            email=email,
            name=name,
            phone=phone,
            specialization=specialization,
            hospital=hospital,
        )
        doctor.set_password(password)
        doctor.save(using=self._db)
        return doctor

    def create_superuser(self, email, name, phone, specialization="Admin", password=None):
        doctor = self.create_user(
            email=email,
            name=name,
            phone=phone,
            specialization=specialization,
            password=password
        )
        doctor.is_staff = True
        doctor.is_superuser = True
        doctor.save(using=self._db)
        return doctor

class Doctor(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    specialization = models.CharField(max_length=255)
    hospital = models.CharField(max_length=255, null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = DoctorManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone']

    def __str__(self):
        return self.name
