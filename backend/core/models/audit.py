from django.db import models
from .company import Company
from .user import CustomUser

class AuditLog(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='audit_logs')
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255) # Örn: "Kompresör Silindi", "Bakım Onaylandı"
    model_name = models.CharField(max_length=100, help_text="İşlem yapılan tablo")
    object_id = models.PositiveIntegerField(help_text="İşlem yapılan kaydın ID'si")
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"{self.timestamp} - {self.user} - {self.action}"