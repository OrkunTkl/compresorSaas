from django.db import models
from .company import Company
from .compressor import Compressor
from .maintenance import MaintenancePlan

class MaintenanceTask(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('approved', 'Approved'),
    )
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='tasks')
    compressor = models.ForeignKey(Compressor, on_delete=models.CASCADE, related_name='maintenance_tasks')
    plan = models.ForeignKey(MaintenancePlan, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    due_date = models.DateField()
    assigned_to = models.ForeignKey('core.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks')
    completed_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Task: {self.compressor.name} - {self.status} ({self.due_date})"