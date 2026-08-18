from rest_framework import serializers
from core.models.iot_device import IoTDevice


class IoTDeviceSerializer(serializers.ModelSerializer):

    compressor_name = serializers.CharField(
        source="compressor.name",
        read_only=True
    )

    class Meta:
        model = IoTDevice
        fields = [
            "id",
            "company",
            "compressor",
            "compressor_name",
            "device_id",
            "name",
            "status",
            "last_sync",
        ]

        read_only_fields = ["id", "last_sync"]