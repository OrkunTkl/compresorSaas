from rest_framework import serializers
from core.models.integration import Integration


class IntegrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Integration
        fields = [
            "id",
            "company",
            "system",
            "status",
            "credentials",
        ]

        read_only_fields = ["id"]