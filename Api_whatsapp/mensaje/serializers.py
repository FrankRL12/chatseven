from rest_framework import serializers
from .models import Mensaje
from archivos.models import MultimediaFile
import json
import datetime
import pytz  # Para manejar las zonas horarias

class MensajeSerializer(serializers.ModelSerializer):
    mensaje_formateado = serializers.SerializerMethodField()

    class Meta:
        model = Mensaje
        fields = [
            'idusuario', 'contacto', 'textomensaje', 'wanidmensaje',
            'fecharegistro', 'json', 'tipomensaje', 'estado', 'mensaje_formateado'
        ]

    def get_mensaje_formateado(self, obj):
        formatted_message = {}
        local_tz = pytz.timezone('America/Mexico_City')

        if obj.estado == 'recibido':
            try:
                json_data = json.loads(obj.json)
                message_data = json_data.get('message', {})
                timestamp = message_data.get('timestamp', '')
                message_type = message_data.get('type', '')
                contacts = json_data.get('contacts', [])
                media_id = None
                text = ""

                if contacts:
                    contact = contacts[0]
                    wa_id = contact.get('wa_id', '')
                    profile = contact.get('profile', {})
                    name = profile.get('name', '')

                    if timestamp:
                        # Convertir timestamp a la zona horaria local
                        utc_time = datetime.datetime.fromtimestamp(int(timestamp), tz=pytz.UTC)
                        local_time = utc_time.astimezone(local_tz)
                        formatted_timestamp = local_time.strftime('%Y-%m-%d %I:%M:%S %p').lower()
                    else:
                        # Convertir fecharegistro a la zona horaria local
                        local_time = obj.fecharegistro.astimezone(local_tz)
                        formatted_timestamp = local_time.strftime('%Y-%m-%d %I:%M:%S %p').lower()

                    # Manejo de mensajes multimedia
                    if message_type in ['image', 'video', 'audio', 'sticker']:
                        media_id = message_data.get(message_type, {}).get('id', '')

                        try:
                            multimedia_file = MultimediaFile.objects.get(multimedia_id=media_id)
                            file_name = multimedia_file.archivos.name.split('/')[-1]
                            text = f"http://127.0.0.1:8000/media/{file_name}"
                        except MultimediaFile.DoesNotExist:
                            pass

                    formatted_message = {
                        'timestamp': formatted_timestamp,
                        'text': text,
                        'type': message_type,
                        'name': name,
                        'wa_id': wa_id,
                        'media_id': media_id,
                        'estado': 'recibido'
                    }
                else:
                    raise ValueError('No se encontraron contactos en el mensaje recibido.')

            except (json.JSONDecodeError, ValueError) as e:
                formatted_message = {
                    'error': str(e),
                    'estado': 'recibido'
                }

        elif obj.estado == 'enviado':
            try:
                json_data = json.loads(obj.json)
                contacts = json_data.get('contacts', [])
                if contacts:
                    contact = contacts[0]
                    wa_id = contact.get('wa_id', '')

                    # Convertir fecharegistro a la zona horaria local
                    local_time = obj.fecharegistro.astimezone(local_tz)
                    formatted_message = {
                        'wa_id': wa_id,
                        'textomensaje': obj.textomensaje,
                        'timestamp': local_time.strftime('%Y-%m-%d %I:%M:%S %p').lower(),
                        'estado': 'enviado'
                    }
                else:
                    raise ValueError('No se encontraron contactos en el mensaje enviado.')

            except (json.JSONDecodeError, ValueError) as e:
                formatted_message = {
                    'error': str(e),
                    'estado': 'enviado'
                }

        else:
            local_time = obj.fecharegistro.astimezone(local_tz)
            formatted_message = {
                'mensaje': obj.textomensaje,
                'timestamp': local_time.strftime('%Y-%m-%d %I:%M:%S %p').lower(),
                'estado': 'otro'
            }

        return formatted_message