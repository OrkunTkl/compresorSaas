from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class MaintenanceReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Raporlama mantığı buraya gelecek (Service katmanından beslenebilir)
        return Response({"detail": "Maintenance history report data"})