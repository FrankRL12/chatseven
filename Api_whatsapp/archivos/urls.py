from django.urls import path, include
from .views import FacebookDataAPIView, WhatsAppWebhookAPIView, CombinedDataAPIView, MultimediaDataAPIView, EnviarMensajeAPIView
from rest_framework import routers
from .import views


router = routers.DefaultRouter()
router.register(r'archivo', views.ArchivosViewset, 'archivo')

urlpatterns = [
    path('facebook-data/', FacebookDataAPIView.as_view(), name='facebook-data'),
    path('whatsapp-webhook/', WhatsAppWebhookAPIView.as_view(), name='whatsapp-webhook'),
    path('combined-data/', MultimediaDataAPIView.as_view(), name='combined-data'),
    path('enviar-mensaje/', EnviarMensajeAPIView.as_view(), name='enviar-mensaje'),
    path('api/v1/', include(router.urls)),
]