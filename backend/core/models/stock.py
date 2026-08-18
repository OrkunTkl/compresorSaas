from django.db import models
from .company import Company

class Stock(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='stocks')
    part_name = models.CharField(max_length=255)
    part_number = models.CharField(max_length=100, blank=True, null=True)
    quantity = models.IntegerField(default=0)
    critical_level = models.IntegerField(default=5, help_text="Stok bu seviyenin altına düşerse uyarı ver.")
    unit = models.CharField(max_length=20, default='adet')

    def __str__(self):
        return f"{self.part_name} - {self.quantity} {self.unit}"