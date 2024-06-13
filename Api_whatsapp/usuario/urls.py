from django.urls import path, include
from rest_framework import routers
from .views import UsuarioViewSet
from .import views


router = routers.DefaultRouter()
router.register(r'usuario', views.UsuarioViewSet, 'usuario')

urlpatterns = [
    path('api/v1/', include(router.urls)),
]