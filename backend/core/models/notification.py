from django.db import models
from .company import Company
from .user import CustomUser


class Notification(models.Model):

    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    title = models.CharField(max_length=255)

    message = models.TextField()

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)