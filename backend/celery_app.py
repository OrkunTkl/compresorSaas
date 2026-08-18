import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_root.settings')

app = Celery('CompressorCare')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Zamanlanmış Görevler (Cron Job)
app.conf.beat_schedule = {
    'daily-maintenance-check': {
        'task': 'core.tasks.run_maintenance_checks',
        'schedule': crontab(hour=0, minute=0), # Her gece yarısı çalışır
    },
}