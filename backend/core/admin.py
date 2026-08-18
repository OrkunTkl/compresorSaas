from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models.user import CustomUser  # Dosya yolun hangisiyse ona göre çek
from .models.company import Company

# Şirketi basitçe kaydet
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

# CustomUser'ı Admin panelinde güzelce göster
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # Panelde görünecek sütunlar
    list_display = ('email', 'username', 'role', 'company', 'is_staff')
    # Yan taraftaki filtreleme seçenekleri
    list_filter = ('role', 'is_staff', 'is_superuser', 'company')
    # Arama kutusu
    search_fields = ('email', 'username')
    # Düzenleme ekranındaki gruplar
    fieldsets = UserAdmin.fieldsets + (
        ('Ek Bilgiler', {'fields': ('role', 'company')}),
    )
    # Yeni kullanıcı ekleme ekranı
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Ek Bilgiler', {'fields': ('role', 'company', 'email')}),
    )