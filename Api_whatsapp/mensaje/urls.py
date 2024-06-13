from django.urls import path, include
from .import views
from rest_framework import routers
from .views import GuardarMensajeAPI

router = routers.DefaultRouter()
router.register(r'mensaje', views.MensajeViewset, 'mensaje')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('guardar-mensaje/', GuardarMensajeAPI.as_view(), name='guardar-mensaje'),
]