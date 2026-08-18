from django.db import models
from .company import Company
from .compressor import Compressor
from .team import Team


class MaintenancePlan(models.Model):

    STATUS_CHOICES = [
        ("active", "Active"),
        ("draft", "Draft"),
    ]

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="maintenance_plans"
    )

    compressors = models.ManyToManyField(
        Compressor,
        related_name="maintenance_plans"
    )

    name = models.CharField(max_length=255)

    team = models.ForeignKey(
        Team,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="maintenance_plans"
    )

    interval_days = models.PositiveIntegerField(default=30)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft"
    )

    checklist = models.JSONField(default=list)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.company.name})"