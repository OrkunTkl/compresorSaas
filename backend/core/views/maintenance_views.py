from core.models.maintenance import MaintenancePlan
from core.serializers.maintenance_serializer import MaintenancePlanSerializer
from .base_views import BaseCompanyViewSet

class MaintenancePlanViewSet(BaseCompanyViewSet):
    queryset = MaintenancePlan.objects.all()
    serializer_class = MaintenancePlanSerializer