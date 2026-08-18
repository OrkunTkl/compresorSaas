from rest_framework import viewsets, permissions
from core.models.stock import Stock
from core.serializers.stock_serializer import StockSerializer


class StockViewSet(viewsets.ModelViewSet):

    serializer_class = StockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Stock.objects.filter(
            company=self.request.user.company
        )

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)