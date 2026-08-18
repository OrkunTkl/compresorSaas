from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from core.models.task import MaintenanceTask
from core.serializers.task_serializer import MaintenanceTaskSerializer
from .base_views import BaseCompanyViewSet

class MaintenanceTaskViewSet(BaseCompanyViewSet):
    queryset = MaintenanceTask.objects.all()
    serializer_class = MaintenanceTaskSerializer

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        task = self.get_object()
        task.status = 'approved'
        task.approved_at = timezone.now()
        task.save()
        return Response({'status': 'Task approved'})