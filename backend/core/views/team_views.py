from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from core.models.team import Team
from core.models.user import CustomUser
from core.serializers.team_serializer import TeamSerializer

class TeamViewSet(viewsets.ModelViewSet):
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Team.objects.filter(company=user.company)

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)

    @action(detail=True, methods=['post'], url_path='remove_member')
    def remove_member(self, request, pk=None):
        """
        REMOVES RELATION, DOES NOT DELETE USER!
        """
        team = self.get_object()
        user_id = request.data.get('user_id')

        if not user_id:
            return Response({"detail": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Üyeyi bul (Kendi şirketinden olduğundan emin ol)
        member = get_object_or_404(CustomUser, id=user_id, company=request.user.company)

        # Üye bu takımda mı kontrol et
        if member.team != team:
            return Response({"detail": "User is not in this team."}, status=status.HTTP_400_BAD_REQUEST)

        # KRİTİK NOKTA: Sadece team alanını None yapıyoruz
        member.team = None 
        member.save() # Veritabanında sadece bu alanı günceller

        return Response({"detail": "Member removed from team (User record kept)."}, status=status.HTTP_200_OK)