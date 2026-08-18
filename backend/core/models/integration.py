from django.db import models
from .company import Company

class Integration(models.Model):

    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    system = models.CharField(
        choices=[
            ("sap", "SAP"),
            ("oracle", "Oracle"),
            ("dynamics", "Microsoft Dynamics")
        ],
        max_length=50
    )

    status = models.CharField(
        choices=[
            ("connected", "Connected"),
            ("disconnected", "Disconnected")
        ],
        max_length=20
    )

    credentials = models.JSONField(null=True, blank=True)