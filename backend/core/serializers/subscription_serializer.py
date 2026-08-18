from rest_framework import serializers
from core.models.subscription import Subscription

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'company', 'plan_type', 'status', 'start_date', 'next_billing_date']
        read_only_fields = ['company', 'start_date']