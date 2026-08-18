# core/serializers/__init__.py
from .company_serializer import CompanySerializer
from .user_serializer import UserSerializer
from .compressor_serializer import CompressorSerializer
from .maintenance_serializer import MaintenancePlanSerializer
from .task_serializer import MaintenanceTaskSerializer
from .stock_serializer import StockSerializer
from .subscription_serializer import SubscriptionSerializer
from .team_serializer import TeamSerializer
from .notification_serializer import NotificationSerializer
from .iot_device_serializer import IoTDeviceSerializer
from .integration_serializer import IntegrationSerializer
from .webhook_serializer import WebhookSerializer
from .api_key_serializer import ApiKeySerializer
# report_serializer'ı buraya eklemiyoruz, çünkü o ModelViewSet değil