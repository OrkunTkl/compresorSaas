from rest_framework import serializers
from core.models.compressor import Compressor

class CompressorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compressor
        fields = '__all__'
        read_only_fields = ('company',) # ViewSet içinde otomatik atanacak