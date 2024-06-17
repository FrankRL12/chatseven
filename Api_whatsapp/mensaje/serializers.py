from rest_framework import serializers
from .models import Mensaje
import json
import datetime



class MensajeSerializer(serializers.ModelSerializer):
    mensaje_formateado = serializers.SerializerMethodField()

    class Meta:
        model = Mensaje
        fields = ['idusuario', 'contacto', 'textomensaje', 'wanidmensaje', 'fecharegistro', 'json', 'tipomensaje', 'estado', 'mensaje_formateado']

    def get_mensaje_formateado(self, obj):
        formatted_message = {}

        if obj.estado == 'recibido':
            try:
                json_data = json.loads(obj.json)
                message_data = json_data.get('message', {})
                timestamp = message_data.get('timestamp', '')
                text = message_data.get('text', {}).get('body', '')
                message_type = message_data.get('type', '')
                contacts = json_data.get('contacts', [])
                if contacts:
                    contact = contacts[0]
                    wa_id = contact.get('wa_id', '')
                    profile = contact.get('profile', {})
                    name = profile.get('name', '')

                    if timestamp:
                        # Convertir timestamp a entero y luego a datetime
                        formatted_timestamp = datetime.datetime.fromtimestamp(int(timestamp)).strftime('%Y-%m-%d %I:%M:%S %p').lower()
                    else:
                        formatted_timestamp = obj.fecharegistro.strftime('%Y-%m-%d %I:%M:%S %p').lower()

                    formatted_message = {
                        'timestamp': formatted_timestamp,
                        'text': text,
                        'type': message_type,
                        'name': name,
                        'wa_id': wa_id,
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
            formatted_message = {
                'mensaje': obj.textomensaje,
                'timestamp': obj.fecharegistro.strftime('%Y-%m-%d %I:%M:%S %p').lower(),
                'estado': 'otro'
            }

        return formatted_message