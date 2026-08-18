from celery import shared_task
from core.models.compressor import Compressor
from core.services.maintenance_engine import MaintenanceEngine

@shared_task
def run_maintenance_checks():
    """
    Sistemdeki tüm kompresörleri tarar ve bakım zamanı 
    gelenler için görev oluşturur.
    """
    compressors = Compressor.objects.all()
    for compressor in compressors:
        # Önce günlük ortalama çalışma saatini mevcut saate ekleyelim (Simülasyon)
        compressor.current_hours += compressor.average_daily_hours
        compressor.save()

        # Sonra Engine'i çağırıp kontrol yapalım
        MaintenanceEngine.calculate_and_create_tasks(compressor)

    return f"{compressors.count()} kompresör kontrol edildi."