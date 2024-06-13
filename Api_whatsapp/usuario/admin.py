from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Usuario

class UsuarioAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'is_admin')
    list_filter = ('is_staff', 'is_active', 'is_admin')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información personal', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permisos', {'fields': ('is_admin', 'is_staff', 'is_active', 'is_superadmin')}),
        ('Fechas importantes', {'fields': ('last_login',)}),  # Removed 'date_joined'
    )
    readonly_fields = ('last_login', 'date_joined')  # Make fields read-only

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('username',)
    filter_horizontal = ()

admin.site.register(Usuario, UsuarioAdmin)
