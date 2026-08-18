from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from core.models.task import MaintenanceTask

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company = request.user.company
        now = timezone.now()

        overdue_tasks = MaintenanceTask.objects.filter(
            company=company,
            status__in=['pending', 'assigned'],
            due_date__lt=now.date()
        ).count()

        upcoming_tasks = MaintenanceTask.objects.filter(
            company=company,
            due_date__range=[now.date(), now.date() + timezone.timedelta(days=7)]
        ).count()

        return Response({
            "overdue_count": overdue_tasks,
            "upcoming_7_days": upcoming_tasks,
            "company_name": company.name
        })