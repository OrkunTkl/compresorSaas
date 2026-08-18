from django.db.models import Count, Avg, F, ExpressionWrapper, fields
from django.utils import timezone
from core.models.task import MaintenanceTask
from core.models.compressor import Compressor
from core.models.stock import Stock
import pandas as pd
from io import BytesIO

class ReportService:
    @staticmethod
    def get_company_maintenance_summary(company):
        tasks = MaintenanceTask.objects.filter(company=company)
        compressors = Compressor.objects.filter(company=company)
        
        duration_expr = ExpressionWrapper(
            F('completed_at') - F('due_date'),
            output_field=fields.DurationField()
        )
        
        avg_mttr = tasks.filter(
            status__in=['completed', 'approved'], 
            completed_at__isnull=False
        ).annotate(repair_duration=duration_expr).aggregate(
            Avg('repair_duration')
        )['repair_duration__avg']

        summary = {
            "overview": {
                "total_compressors": compressors.count(),
                "total_tasks": tasks.count(),
                "completed_tasks": tasks.filter(status__in=['completed', 'approved']).count(),
                "pending_tasks": tasks.filter(status__in=['pending', 'assigned', 'in_progress']).count(),
                "overdue_tasks": tasks.filter(
                    status__in=['pending', 'assigned'], 
                    due_date__lt=timezone.now().date()
                ).count(),
            },
            "performance": {
                "avg_mttr": avg_mttr.total_seconds()/3600 if avg_mttr else 0, # saat cinsinden
                "success_rate": round(
                    0 if tasks.count() == 0 else (
                        tasks.filter(status__in=['completed', 'approved']).count() / tasks.count() * 100
                    ), 2
                )
            },
            "stock_alerts": list(Stock.objects.filter(
                company=company, 
                quantity__lte=F('critical_level')
            ).values('part_name', 'quantity', 'unit'))
        }
        return summary

    @staticmethod
    def export_maintenance_history(company, export_format='json'):
        history_data = MaintenanceTask.objects.filter(company=company).select_related('compressor', 'plan').values(
            'compressor__name',
            'compressor__model',
            'due_date',
            'status',
            'completed_at',
            'description'
        )

        if export_format == 'json':
            return list(history_data)
        
        elif export_format in ['excel', 'xlsx']:
            df = pd.DataFrame(list(history_data))
            buffer = BytesIO()
            df.to_excel(buffer, index=False)
            buffer.seek(0)
            return buffer  # view veya response içinde dosya gönderilebilir
        
        # opsiyonel: pdf
        elif export_format == 'pdf':
            # ReportLab veya benzeri ile üretilebilir
            return history_data
        
        return None