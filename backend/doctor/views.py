from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status, serializers
from drf_spectacular.utils import extend_schema
from .serializers import DoctorSerializer
from django.contrib.auth import authenticate


@extend_schema(
    request=DoctorSerializer,
    responses={201: DoctorSerializer},
    description='Register a new doctor account',
)
@api_view(['POST'])
@permission_classes([AllowAny])
def doctor_signup(request):
    serializer = DoctorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'doctor': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DoctorLoginSerializer(serializers.Serializer):
    """Used only so Swagger/drf-spectacular can document the expected
    request body for doctor_login, which reads request.data manually."""
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})


@extend_schema(
    request=DoctorLoginSerializer,
    description='Authenticate a doctor with email and password',
)
@api_view(['POST'])
@permission_classes([AllowAny])
def doctor_login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if email is None or password is None:
        return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    doctor = authenticate(request, email=email, password=password)
    if doctor is None:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        "doctor": {
            "id": doctor.id,
            "name": doctor.name,
            "email": doctor.email,
            "phone": doctor.phone,
            "specialization": doctor.specialization,
            "hospital": doctor.hospital
        }
    })