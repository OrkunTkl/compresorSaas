from rest_framework import viewsets, permissions
from core.models.company import Company
from core.serializers.company_serializer import CompanySerializer


class CompanyViewSet(viewsets.ModelViewSet):

    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Company.objects.filter(
            id=self.request.user.company.id
        )