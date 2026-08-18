from django.db import models
from .company import Company

class ApiKey(models.Model):

    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    name = models.CharField(max_length=255)

    key = models.CharField(max_length=64, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)

    last_used = models.DateTimeField(null=True, blank=True)

    is_active = models.BooleanField(default=True)