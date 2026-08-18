# core/views/__init__.py
from .auth_views import RegisterView, MeView
from .compressor_views import CompressorViewSet
from .maintenance_views import MaintenancePlanViewSet
from .task_views import MaintenanceTaskViewSet
from .dashboard_views import DashboardSummaryView
from .subscription_views import SubscriptionViewSet
from .report_views import MaintenanceReportView
from .team_views import TeamViewSet
from .user_views import UserViewSet
from .notification_views import NotificationViewSet
from .iot_views import IoTDeviceViewSet
from .integration_views import IntegrationViewSet
from .company_views import CompanyViewSet
from .stock_views import StockViewSet