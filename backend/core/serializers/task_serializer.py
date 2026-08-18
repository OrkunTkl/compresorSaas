from rest_framework import serializers
from core.models.task import MaintenanceTask

class MaintenanceTaskSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = MaintenanceTask
        fields = [
            'id', 'company', 'compressor', 'plan', 'status', 
            'status_display', 'due_date', 'completed_at', 'approved_at', 'description'
        ]
        read_only_fields = ['company']