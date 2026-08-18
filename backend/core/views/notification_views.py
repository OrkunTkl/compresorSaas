from rest_framework import viewsets, permissions
from core.models.notification import Notification
from core.serializers.notification_serializer import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):

    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            company=self.request.user.company
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)