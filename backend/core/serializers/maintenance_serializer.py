# core/serializers/maintenance_serializer.py
from rest_framework import serializers
from core.models.maintenance import MaintenancePlan
from core.models.compressor import Compressor

class MaintenancePlanSerializer(serializers.ModelSerializer):
    # Frontend'den gelen compressor ID'lerini kabul etmek için
    compressors = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Compressor.objects.all()
    )

    class Meta:
        model = MaintenancePlan
        fields = [
            'id', 'name', 'team', 'interval_days', 
            'status', 'checklist', 'compressors', 'is_active'
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        # BaseCompanyViewSet kullandığın için company'yi request'ten alıyoruz
        validated_data['company'] = self.context['request'].user.company 
        return super().create(validated_data)