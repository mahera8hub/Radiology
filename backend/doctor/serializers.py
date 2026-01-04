from rest_framework import serializers
from .models import Doctor
from django.contrib.auth.password_validation import validate_password

class DoctorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirmPassword = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Doctor
        fields = ['name', 'email', 'phone', 'specialization', 'hospital', 'password', 'confirmPassword']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirmPassword']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirmPassword')
        doctor = Doctor.objects.create_user(**validated_data)
        return doctor
