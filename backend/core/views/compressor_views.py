from core.models.compressor import Compressor
from core.serializers.compressor_serializer import CompressorSerializer
from .base_views import BaseCompanyViewSet
from rest_framework.permissions import AllowAny # Bunu yukarı ekle

class CompressorViewSet(BaseCompanyViewSet):
    queryset = Compressor.objects.all()
    serializer_class = CompressorSerializer
    permission_classes = [AllowAny]