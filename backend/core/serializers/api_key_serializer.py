from rest_framework import serializers
from core.models.api_key import ApiKey


class ApiKeySerializer(serializers.ModelSerializer):

    class Meta:
        model = ApiKey
        fields = [
            "id",
            "company",
            "name",
            "key",
            "is_active",
            "created_at",
            "last_used",
        ]

        read_only_fields = [
            "id",
            "key",
            "created_at",
            "last_used",
        ]