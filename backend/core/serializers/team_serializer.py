from rest_framework import serializers
from core.models.team import Team
from django.contrib.auth import get_user_model

User = get_user_model()

# Önce üyelerin hangi bilgilerini göndereceğimizi belirleyen basit bir serializer
class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "is_active", "first_name", "last_name"]

class TeamSerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()
    # KRİTİK NOKTA: related_name="members" olduğu için bunu kullanıyoruz
    members_detail = TeamMemberSerializer(source='members', many=True, read_only=True)

    class Meta:
        model = Team
        fields = [
            "id",
            "name",
            "description",
            "company",
            "members_count",
            "members_detail", # Buraya ekledik
            "is_active",
            "created_at",
            "updated_at"
        ]
        read_only_fields = ["company", "created_at", "updated_at"]

    def get_members_count(self, obj):
        return obj.members.count()

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request.user, 'company'):
            validated_data["company"] = request.user.company # <--- Overwriting happens here
        return super().create(validated_data)