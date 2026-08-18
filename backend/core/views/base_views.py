from rest_framework import viewsets, permissions

class BaseCompanyViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Kullanıcının sadece kendi şirketine ait verileri görmesini sağlar
        return self.queryset.filter(company=self.request.user.company)

    def perform_create(self, serializer):
        # Kayıt oluşturulurken şirketi otomatik olarak giriş yapan kullanıcıdan alır
        serializer.save(company=self.request.user.company)
        

def get_queryset(self):
    user = self.request.user
    
    # 1. Eğer admin panelinden giren süper adminsen her şeyi gör
    if user.is_superuser:
        return self.queryset.all()

    # 2. Eğer normal kullanıcıysan ve giriş yaptıysan sadece şirketini gör
    if user.is_authenticated and hasattr(user, 'company'):
        return self.queryset.filter(company=user.company)
    
    # 3. Giriş yapmadıysan hata verme, boş liste döndür (Güvenlik)
    return self.queryset.none()