from rest_framework import serializers
from .models import Mensaje
from archivos.models import MultimediaFile
import json
import datetime

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

        if obj.estado == 'recibido':
            try:
                json_data = json.loads(obj.json)
                message_data = json_data.get('message', {})
                timestamp = message_data.get('timestamp', '')
                message_type = message_data.get('type', '')
                contacts = json_data.get('contacts', [])
                media_id = None  # Variable para almacenar el id del multimedia
                text = ""  # Inicializar text

                if contacts:
                    contact = contacts[0]
                    wa_id = contact.get('wa_id', '')
                    profile = contact.get('profile', {})
                    name = profile.get('name', '')

                    if timestamp:
                        formatted_timestamp = datetime.datetime.fromtimestamp(int(timestamp)).strftime('%Y-%m-%d %I:%M:%S %p').lower()
                    else:
                        formatted_timestamp = obj.fecharegistro.strftime('%Y-%m-%d %I:%M:%S %p').lower()

                    # Revisar si es un tipo de mensaje multimedia
                    if message_type in ['image', 'video', 'audio', 'sticker']:
                        media_id = message_data.get(message_type, {}).get('id', '')

                        # Consultar si existe un registro MultimediaFile con el mismo media_id y extensión
                        try:
                            multimedia_file = MultimediaFile.objects.get(multimedia_id=media_id)
                            file_name = multimedia_file.archivos.name.split('/')[-1]  # Obtener solo el nombre del archivo
                            text = f"http://127.0.0.1:8000/media/{file_name}"  # Obtener la URL completa del archivo

                        except MultimediaFile.DoesNotExist:
                            pass  # Dejar text como ""

                    formatted_message = {
                        'timestamp': formatted_timestamp,
                        'text': text,  # Utilizar el nombre del archivo si existe
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

                    formatted_message = {
                        'wa_id': wa_id,
                        'textomensaje': obj.textomensaje,
                        'timestamp': obj.fecharegistro.strftime('%Y-%m-%d %I:%M:%S %p').lower(),
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
            # Para mensajes con estado 'otro', simplemente mostrar el mensaje y la fecha
            formatted_message = {
                'mensaje': obj.textomensaje,
                'timestamp': obj.fecharegistro.strftime('%Y-%m-%d %I:%M:%S %p').lower(),
                'estado': 'otro'
            }

        return formatted_message