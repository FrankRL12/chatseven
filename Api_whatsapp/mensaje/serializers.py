from rest_framework import serializers
from mensaje.models import Mensaje
from catalago.models import TipoMensaje



class MensajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mensaje
        fields = '__all__'