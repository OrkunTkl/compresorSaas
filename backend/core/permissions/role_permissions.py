from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    """Sadece sistem genelindeki Super Adminler için."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'super_admin')

class IsAdminUser(permissions.BasePermission):
    """Şirket adminleri için (Manager ve Super Admin dahil)."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['admin', 'super_admin'])

class IsTechnician(permissions.BasePermission):
    """Sadece teknisyenler için."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'technician')

class IsScalePlan(permissions.BasePermission):
    """
    Sadece 'Scale' planına sahip şirketler için (Örn: Excel Export).
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated and request.user.company):
            return False
        
        # Subscription modeline erişip planı kontrol ediyoruz
        try:
            return request.user.company.subscription.plan_type == "scale"
        except:
            return False

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Nesne bazlı kontrol: Veriyi sadece sahibi veya admin görebilir.
    """
    def has_object_permission(self, request, view, obj):
        # Admin her şeyi yapabilir
        if request.user.role in ['admin', 'super_admin']:
            return True
        # Diğerleri sadece kendi şirketine aitse (zaten queryset ile filtreleniyor ama ekstra güvenlik)
        return obj.company == request.user.company