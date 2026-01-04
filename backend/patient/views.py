# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import PatientHistory
# from .serializers import PatientHistorySerializer

# class DoctorPatientHistoryView(APIView):
#     def get(self, request, doctor_id):
#         histories = PatientHistory.objects.filter(doctor_id=doctor_id).order_by('-created_at')
#         serializer = PatientHistorySerializer(histories, many=True)
#         return Response({"records": serializer.data}, status=status.HTTP_200_OK)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from doctor.models import Record
from rest_framework.pagination import PageNumberPagination

class DoctorHistoryView(APIView):
    def get(self, request, doctor_id):
        records = Record.objects.filter(doctor_id=doctor_id).select_related('patient').order_by('-created_at')
        
        # Pagination
        paginator = PageNumberPagination()
        paginator.page_size = 10  # 10 records per page
        result_page = paginator.paginate_queryset(records, request)
        
        data = [
            {
                "id": r.id,
                "patient_name": r.patient.name,
                "prediction": r.prediction,
                "notes": r.notes,
                "created_at": r.created_at,
            }
            for r in result_page
        ]
        return paginator.get_paginated_response(data)
