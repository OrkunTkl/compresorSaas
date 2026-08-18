from rest_framework import serializers
from core.models.stock import Stock

class StockSerializer(serializers.ModelSerializer):
    is_critical = serializers.SerializerMethodField()

    class Meta:
        model = Stock
        fields = ['id', 'company', 'part_name', 'part_number', 'quantity', 'critical_level', 'unit', 'is_critical']
        read_only_fields = ['company']

    def get_is_critical(self, obj):
        return obj.quantity <= obj.critical_level