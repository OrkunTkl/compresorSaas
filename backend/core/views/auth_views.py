from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from core.models.user import CustomUser
# Dosya yolunun core/serializers/user_serializer.py olduğundan emin ol
from core.serializers.user_serializer import UserSerializer, RegisterSerializer 

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class MeView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user