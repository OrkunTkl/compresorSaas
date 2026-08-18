from core.models.subscription import Subscription

class SubscriptionService:
    @staticmethod
    def check_feature_access(company, feature_name):
        """
        Şirketin planına göre özelliğe erişimi kontrol eder.
        DB'den plan limitleri okunur.
        """
        try:
            sub = company.subscription
            if not sub.is_active or sub.status == 'canceled':
                return False

            # DB'den plan limitlerini al (opsiyonel: JSONField veya başka model)
            plan_limits = sub.get_plan_features()  # plan modelinde tanımlanmalı
            return feature_name in plan_limits
        except Subscription.DoesNotExist:
            return False

    @staticmethod
    def upgrade_plan(company, new_plan_type):
        sub, _ = Subscription.objects.get_or_create(company=company)
        sub.plan_type = new_plan_type
        sub.save()
        return sub