from django.urls import path
from .views import FacebookDataAPIView, WhatsAppWebhookAPIView, CombinedDataAPIView, MultimediaDataAPIView

urlpatterns = [
    path('facebook-data/', FacebookDataAPIView.as_view(), name='facebook-data'),
    path('whatsapp-webhook/', WhatsAppWebhookAPIView.as_view(), name='whatsapp-webhook'),
    path('combined-data/', MultimediaDataAPIView.as_view(), name='combined-data'),
]