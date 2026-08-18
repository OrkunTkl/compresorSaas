from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# views/__init__.py içindeki GERÇEK isimleri import ediyoruz
from .views import (
    RegisterView, 
    MeView, 
    CompressorViewSet, 
    MaintenancePlanViewSet, 
    MaintenanceTaskViewSet, 
    DashboardSummaryView, 
    SubscriptionViewSet, 
    MaintenanceReportView,
    TeamViewSet,
    UserViewSet,
    NotificationViewSet,
    IoTDeviceViewSet,
    IntegrationViewSet,
    StockViewSet,
    CompanyViewSet,
)

router = DefaultRouter()
router.register(r'compressors', CompressorViewSet, basename='compressor')
router.register(r'plans', MaintenancePlanViewSet, basename='maintenance-plan')
router.register(r'tasks', MaintenanceTaskViewSet, basename='maintenance-task')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r"teams", TeamViewSet, basename="teams")
router.register(r"users", UserViewSet, basename="user")

router.register("notifications", NotificationViewSet, basename="notifications")
router.register("iot-devices", IoTDeviceViewSet, basename="iot-devices")
router.register("integrations", IntegrationViewSet, basename="integrations")
router.register("stocks", StockViewSet, basename="stocks")
router.register("companies", CompanyViewSet, basename="companies")


urlpatterns = [
    # Router çıktıları (compressors, plans, tasks, subscriptions)
    path('', include(router.urls)),

    # Auth İşlemleri
    path("auth/register/", RegisterView.as_view(), name='auth_register'),
    path("auth/me/", MeView.as_view(), name='auth_me'),
    path("token/", TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("token/refresh/", TokenRefreshView.as_view(), name='token_refresh'),

    # Özel View'lar (Dashboard ve Raporlar)
    path("dashboard/summary/", DashboardSummaryView.as_view(), name='dashboard_summary'),
    path("reports/maintenance/", MaintenanceReportView.as_view(), name='maintenance_report'),
]