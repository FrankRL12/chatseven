from django.shortcuts import render
from rest_framework import viewsets
from .models import Mensaje
from .serializers import MensajeSerializer
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from catalago.models import TipoMensaje
from contacto.models import Contacto
import requests
import json
from rest_framework.views import APIView
import threading
import time

# Create your views here.


class MensajeViewset(viewsets.ModelViewSet):
    serializer_class = MensajeSerializer

    def get_queryset(self):
        # Obtener y ordenar todos los mensajes por fecha de registro
        queryset = Mensaje.objects.all().order_by('fecharegistro')
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serialized_messages = MensajeSerializer(queryset, many=True).data

        # Agrupar los mensajes según la fecha y hora
        intercalados = self.intercalar_mensajes(serialized_messages)
        
        return Response(intercalados)

    def perform_create(self, serializer):
        tipo_mensaje_codigo = self.request.data.get('tipoMensaje')
        wa_id = self.request.data.get('waid')
        print("Tipo de mensaje recibido desde el frontend:", tipo_mensaje_codigo)
        print("wa_id recibido desde el frontend:", wa_id)

        try:
            tipo_mensaje = TipoMensaje.objects.get(codigo=tipo_mensaje_codigo)
            print("Tipo de mensaje encontrado en la base de datos:", tipo_mensaje)
        except TipoMensaje.DoesNotExist:
            print("Error: Tipo de mensaje con código {} no encontrado en la base de datos".format(tipo_mensaje_codigo))
            tipo_mensaje = None

        try:
            contacto = Contacto.objects.get(waid=wa_id)
            print("Contacto encontrado en la base de datos:", contacto)
        except Contacto.DoesNotExist:
            print("Error: Contacto con wa_id {} no encontrado en la base de datos".format(wa_id))
            contacto = None

        serializer.save(tipomensaje=tipo_mensaje, contacto=contacto)

    def intercalar_mensajes(self, messages):
        # Intercalar los mensajes según la fecha y hora
        intercalados = sorted(messages, key=lambda x: x['mensaje_formateado']['timestamp'])
        return intercalados


class WhatsAppWebhookAPIView(APIView):
    def fetch_data(self):
        while True:
            try:
                url = 'https://seven-brains.com/api/whatsapp-integration-service/client-api/v1/webhook/event'
                params = {
                    'dateFrom': '2024-05-01',
                    'dateTo': '2024-06-17',
                    'from': 0,
                    'size': 3300
                }

                response = requests.get(url, params=params)
                
                if response.status_code != 200:
                    print(f'Failed to fetch data from webhook. Status code: {response.status_code}')
                    continue  # Intentar nuevamente en el próximo ciclo

                payload = response.json()
                
                print("Payload recibido del webhook:")
                print(json.dumps(payload, indent=4))
                
                if 'webhookEventItem' in payload:
                    for event_item in payload['webhookEventItem']:
                        entry = json.loads(event_item['payload'])
                        messages = entry.get('entry', [])[0].get('changes', [])[0].get('value', {}).get('messages', [])
                        contacts = entry.get('entry', [])[0].get('changes', [])[0].get('value', {}).get('contacts', [])
                        
                        for message in messages:
                            wa_id = message.get('from')
                            text = message.get('text', {}).get('body', '')
                            message_id = message.get('id')
                            
                            # Verificar si el mensaje ya existe en la base de datos
                            if not Mensaje.objects.filter(wanidmensaje=message_id).exists():
                                
                                # Guardar el mensaje en la base de datos con estado "recibido"
                                Mensaje.objects.create(
                                    textomensaje=text,
                                    wanidmensaje=message_id,
                                    json=json.dumps({
                        'message': message,
                        'contacts': contacts
                    }),
                                    estado="recibido"
                                )

                time.sleep(2)  # Esperar 2 segundos antes de la próxima solicitud

            except Exception as e:
                print(f'Error al procesar la solicitud: {str(e)}')
                time.sleep(2)  # Esperar 2 segundos en caso de error para evitar sobrecargar el servidor

    def get(self, request, *args, **kwargs):
        # Iniciar la función fetch_data en un hilo separado
        thread = threading.Thread(target=self.fetch_data)
        thread.start()

        return Response({'message': 'Fetching data from webhook every 2 seconds'}, status=status.HTTP_200_OK)

class GuardarMensajeAPI(APIView):
    def post(self, request, *args, **kwargs):
        # Obtener los datos del mensaje de la solicitud
        idusuario = request.data.get('idusuario')
        idcontacto = request.data.get('idcontacto')
        textomensaje = request.data.get('textomensaje')
        wanidmensaje = request.data.get('wanidmensaje')
        tipomensaje_id = request.data.get('tipomensaje_id')

        # Validar que los datos requeridos estén presentes
        if not all([idusuario, idcontacto, textomensaje, wanidmensaje, tipomensaje_id]):
            return Response({'error': 'Faltan datos requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener la fecha y hora actual
        fecha_registro = datetime.now()

        # Construir el cuerpo del mensaje a enviar a la API de Facebook
        mensaje_body = {
            'recipient': {'id': idcontacto},
            'message': {'text': textomensaje}
        }

        # Obtener la URL de la API de Facebook desde las configuraciones
        url_api_facebook = settings.ENVIO_FACEBOOK_URL + f"/{idusuario}/messages"

        # Obtener el token de acceso desde las configuraciones
        token_acceso = settings.TOKEN_ACESSO_FACEBOOK

        try:
            # Enviar la solicitud para guardar el mensaje en la API de Facebook
            response = requests.post(url_api_facebook, json=mensaje_body, params={'access_token': token_acceso})

            # Verificar si la solicitud fue exitosa
            if response.status_code == 200:
                # Guardar el mensaje en la base de datos
                mensaje = Mensaje.objects.create(
                    idusuario_id=idusuario,
                    idcontacto_id=idcontacto,
                    textomensaje=textomensaje,
                    wanidmensaje=wanidmensaje,
                    fecharegistro=fecha_registro,
                    tipomensaje_id=tipomensaje_id
                )

                return Response({'mensaje_id': mensaje.id}, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'Error al enviar el mensaje a la API de Facebook'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)