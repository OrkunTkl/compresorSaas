from django.db import models
from .company import Company

class Webhook(models.Model):

    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    url = models.URLField()

    events = models.JSONField()

    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)