from django.db import models
from .company import Company

class Subscription(models.Model):
    PLAN_CHOICES = (
        ('starter', 'Starter'),
        ('growth', 'Growth'),
        ('scale', 'Scale'),
    )
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('trial', 'Trial'),
        ('past_due', 'Past Due'),
        ('canceled', 'Canceled'),
    )

    company = models.OneToOneField(Company, on_delete=models.CASCADE, related_name='subscription')
    plan_type = models.CharField(max_length=20, choices=PLAN_CHOICES, default='starter')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='trial')
    start_date = models.DateTimeField(auto_now_add=True)
    next_billing_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.company.name} - {self.plan_type}"