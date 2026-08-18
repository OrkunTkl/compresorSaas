from rest_framework import serializers
from core.models.webhook import Webhook


class WebhookSerializer(serializers.ModelSerializer):

    class Meta:
        model = Webhook
        fields = [
            "id",
            "company",
            "url",
            "events",
            "active",
            "created_at",
        ]

        read_only_fields = ["id", "created_at"]