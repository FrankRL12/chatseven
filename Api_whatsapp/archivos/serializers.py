from rest_framework import serializers
from archivos.models import MultimediaFile


class ArchivosSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultimediaFile
        fields = '__all__'


class MessageSerializer(serializers.Serializer):
    telefono = serializers.CharField(max_length=15)
    mensaje = serializers.CharField(max_length=1000)