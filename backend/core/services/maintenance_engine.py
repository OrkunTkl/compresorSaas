from django.utils import timezone
from datetime import timedelta
from core.models.task import MaintenanceTask

class MaintenanceEngine:
    @staticmethod
    def calculate_and_create_tasks(compressor):
        """
        Kompresörün aktif planlarını kontrol eder, 
        saat veya gün bazlı bakım zamanı geldiyse görev açar.
        """
        active_plans = compressor.plans.filter(is_active=True)
        created_tasks = []

        for plan in active_plans:
            should_create = False
            
            # 1. Saat Bazlı Kontrol
            if plan.interval_hours:
                last_task = MaintenanceTask.objects.filter(
                    compressor=compressor,
                    plan=plan,
                    status__in=['completed', 'approved']
                ).order_by('-completed_at').first()

                last_hours = last_task.completed_hours if last_task else 0
                if compressor.current_hours - last_hours >= plan.interval_hours:
                    should_create = True

            # 2. Gün Bazlı Kontrol
            if plan.interval_days:
                last_task = MaintenanceTask.objects.filter(
                    compressor=compressor,
                    plan=plan,
                    status__in=['completed', 'approved']
                ).order_by('-completed_at').first()

                last_date = last_task.completed_at.date() if last_task else compressor.created_at.date()
                if timezone.now().date() >= last_date + timedelta(days=plan.interval_days):
                    should_create = True

            if should_create:
                # Duplicate task engelleme
                exists = MaintenanceTask.objects.filter(
                    compressor=compressor,
                    plan=plan,
                    status__in=['pending', 'assigned']
                ).exists()

                if not exists:
                    due_days = 3  # opsiyonel: plan özel duedate
                    task = MaintenanceTask.objects.create(
                        company=compressor.company,
                        compressor=compressor,
                        plan=plan,
                        due_date=timezone.now().date() + timedelta(days=due_days),
                        description=f"Otomatik oluşturulan bakım: "
                                    f"{plan.interval_hours or ''} saat / {plan.interval_days or ''} gün bakımı.",
                        created_by=None  # opsiyonel: sistem user
                    )
                    created_tasks.append(task)
        
        return created_tasks