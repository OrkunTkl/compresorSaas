from rest_framework import serializers
from django.db import transaction
from core.models.user import CustomUser
from core.models.company import Company
from core.models.team import Team

# 1. Üye Detayları İçin Serializer (Listeleme sırasında kullanılır)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'is_active']

# 2. Takım Serializer (Frontend'in üye listesini çekebilmesi için güncellendi)
class TeamSerializer(serializers.ModelSerializer):
    # KRİTİK: members_detail eklendi. Bu sayede frontend üyeleri görebilecek.
    members_detail = UserSerializer(source='members', many=True, read_only=True)
    members_count = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = [
            "id",
            "name",
            "description",
            "company",
            "members_detail",  # Listede görünmesi için eklendi
            "members_count",
            "is_active",
            "created_at",
            "updated_at"
        ]
        read_only_fields = ["company", "created_at", "updated_at"]

    def get_members_count(self, obj):
        # Related name 'members' olduğu için bu şekilde count alınır
        return obj.members.count()

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["company"] = request.user.company
        return super().create(validated_data)

# 3. Kayıt Serializer (Senin mevcut yapın)
class RegisterSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True)
    team_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(), source='team', required=False, write_only=True
    )

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'company_name', 'username', 'role', 'team_id']

    @transaction.atomic
    def create(self, validated_data):
        company_name = validated_data.pop('company_name', None)
        request = self.context.get('request')
        
        if company_name:
            company = Company.objects.create(name=company_name)
            role = 'admin'
        else:
            if request and request.user.is_authenticated:
                company = request.user.company
                role = validated_data.get('role', 'technician')
            else:
                raise serializers.ValidationError({"detail": "Şirket adı gerekli veya oturum açmalısınız."})

        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data.get('username', validated_data['email']),
            password=validated_data['password'],
            company=company,
            role=role,
            team=validated_data.get('team') 
        )
        return user