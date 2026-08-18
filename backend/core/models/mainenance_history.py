from django.db import models
from .company import Company
from .compressor import Compressor
from .user import CustomUser
from .task import MaintenanceTask


class MaintenanceHistory(models.Model):

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="maintenance_history"
    )

    compressor = models.ForeignKey(
        Compressor,
        on_delete=models.CASCADE,
        related_name="maintenance_history"
    )

    task = models.ForeignKey(
        MaintenanceTask,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    performed_by = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    notes = models.TextField(blank=True)

    checklist_result = models.JSONField(default=list)

    hours_at_service = models.PositiveIntegerField(null=True, blank=True)

    completed_at = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.compressor.name} serviced on {self.completed_at}"