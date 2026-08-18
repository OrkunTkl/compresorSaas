from rest_framework import viewsets, permissions
from core.models.user import CustomUser
from core.serializers.user_serializer import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # SADECE şirkete ait ve rolü 'technician' olanları getir
        return CustomUser.objects.filter(
            company=self.request.user.company,
            role='technician' # Frontend'de sadece bunları listelemek için
        )

    def perform_destroy(self, instance):
        # DELETE isteği atıldığında kullanıcıyı SİLMİYORUZ
        # Sadece takımdan çıkarıyoruz
        instance.team = None
        instance.save()