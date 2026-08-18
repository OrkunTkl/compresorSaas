from rest_framework import serializers
from core.models.notification import Notification


class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = [
            "id",
            "company",
            "user",
            "title",
            "message",
            "is_read",
            "created_at",
        ]

        read_only_fields = ["id", "created_at"]