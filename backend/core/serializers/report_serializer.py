from rest_framework import serializers

class MaintenanceReportSerializer(serializers.Serializer):
    compressor_name = serializers.CharField()
    total_tasks = serializers.IntegerField()
    completed_tasks = serializers.IntegerField()
    pending_tasks = serializers.IntegerField()
    last_maintenance_date = serializers.DateField()