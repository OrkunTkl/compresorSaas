from rest_framework import viewsets, permissions
from core.models.iot_device import IoTDevice
from core.serializers.iot_device_serializer import IoTDeviceSerializer


class IoTDeviceViewSet(viewsets.ModelViewSet):

    serializer_class = IoTDeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return IoTDevice.objects.filter(
            company=self.request.user.company
        )

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)