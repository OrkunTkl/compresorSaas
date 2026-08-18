from core.models.subscription import Subscription
from core.serializers.subscription_serializer import SubscriptionSerializer
from .base_views import BaseCompanyViewSet

class SubscriptionViewSet(BaseCompanyViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    # Sadece görüntüleme ve güncelleme (upgrade) izni verilebilir
    http_method_names = ['get', 'put', 'patch']