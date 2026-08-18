from rest_framework import viewsets, permissions
from core.models.integration import Integration
from core.serializers.integration_serializer import IntegrationSerializer


class IntegrationViewSet(viewsets.ModelViewSet):

    serializer_class = IntegrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Integration.objects.filter(
            company=self.request.user.company
        )

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)