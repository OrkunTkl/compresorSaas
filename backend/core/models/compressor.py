from django.db import models
from .company import Company

class Compressor(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='compressors')
    name = models.CharField(max_length=255)
    model = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, unique=True)
    max_operating_hours = models.PositiveIntegerField(help_text="Maksimum çalışma saati kapasitesi")
    average_daily_hours = models.FloatField(default=8.0, help_text="Günlük ortalama çalışma saati (tahmini)")
    current_hours = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.serial_number}"