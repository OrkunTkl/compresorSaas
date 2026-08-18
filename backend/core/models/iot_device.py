from django.db import models
from .company import Company
from .compressor import Compressor

class IoTDevice(models.Model):

    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    compressor = models.ForeignKey(Compressor, on_delete=models.CASCADE)

    device_id = models.CharField(max_length=100)

    name = models.CharField(max_length=255)

    status = models.CharField(
        choices=[
            ("online","Online"),
            ("offline","Offline")
        ],
        max_length=20
    )

    last_sync = models.DateTimeField(null=True, blank=True)