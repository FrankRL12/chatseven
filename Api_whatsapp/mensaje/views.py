from django.shortcuts import render
from rest_framework import viewsets
from .models import Mensaje
from .serializers import MensajeSerializer
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from catalago.models import TipoMensaje
from contacto.models import Contacto
import requests
import json
from rest_framework.views import APIView
import threading
import time
import os
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import FileSystemStorage
from datetime import datetime, timedelta
from django.views import View
from archivos. models import MultimediaFile
from django.db import OperationalError, connection


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
            print("Error: Tipo de mensaje con código {} no encontrado en la base de datos".format(
                tipo_mensaje_codigo))
            tipo_mensaje = None

        try:
            contacto = Contacto.objects.get(waid=wa_id)
            print("Contacto encontrado en la base de datos:", contacto)
        except Contacto.DoesNotExist:
            print(
                "Error: Contacto con wa_id {} no encontrado en la base de datos".format(wa_id))
            contacto = None

        serializer.save(tipomensaje=tipo_mensaje, contacto=contacto)

    def intercalar_mensajes(self, messages):
        # Intercalar los mensajes según la fecha y hora
        intercalados = sorted(
            messages, key=lambda x: x['mensaje_formateado']['timestamp'])
        return intercalados



# The `WhatsAppWebhookAPIView` class defines a view in Django REST framework that fetches data from a
# webhook URL at regular intervals and processes the received payload.
class WhatsAppWebhookAPIView(APIView):

    def check_database_ready(self):
        """
        Verifica si la base de datos está lista y sincronizada.
        """
        try:
            # Realiza una consulta simple para verificar la conexión
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            return True
        except OperationalError:
            return False

    # Método para obtener y procesar datos del webhook
    def fetch_data(self):
        # Bucle infinito para obtener datos periódicamente
            try:
                if not self.check_database_ready():
                    message = 'La base de datos no está lista. Inténtelo de nuevo más tarde.'
                    return JsonResponse({'message': message}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
                
                # URL del endpoint del webhook
                url = 'https://seven-brains.com/api/whatsapp-integration-service/client-api/v1/webhook/event'
                
                # Parámetros para filtrar los datos por fecha y paginación
                params = {
                    'dateFrom': '2024-05-01',  # Fecha de inicio para filtrar los eventos
                    'dateTo': self.get_current_date(),  # Fecha de fin para filtrar los eventos, dinámica
                    'from': 0,  # Punto de partida para la paginación
                    'size': self.calculate_size()  # Tamaño del lote de datos a obtener, dinámico
                }

                # Realiza la solicitud GET al webhook con los parámetros especificados
                response = requests.get(url, params=params)
                
                # Verifica si la solicitud fue exitosa
                if response.status_code != 200:
                    # Imprime un mensaje de error si la solicitud falla
                    print(f'Failed to fetch data from webhook. Status code: {response.status_code}')
                    # Continua al siguiente ciclo del bucle para intentar nuevamente

                # Obtiene el contenido JSON de la respuesta
                payload = response.json()
                
                # Imprime el payload recibido en un formato legible
                print("Payload recibido del webhook:")
                print(json.dumps(payload, indent=4))
                
                # Verifica si el payload contiene la clave 'webhookEventItem'
                if 'webhookEventItem' in payload:
                    # Itera sobre cada elemento del evento en el payload
                    for event_item in payload['webhookEventItem']:
                        # Convierte el payload del evento a un diccionario
                        entry = json.loads(event_item['payload'])
                        
                        # Extrae los mensajes del payload si existen
                        messages = entry.get('entry', [])[0].get('changes', [])[0].get('value', {}).get('messages', [])
                        # Extrae los contactos del payload si existen
                        contacts = entry.get('entry', [])[0].get('changes', [])[0].get('value', {}).get('contacts', [])
                        
                        # Itera sobre cada mensaje en los mensajes extraídos
                        for message in messages:
                            # Obtiene el ID de WhatsApp del remitente
                            wa_id = message.get('from')
                            # Obtiene el texto del mensaje
                            text = message.get('text', {}).get('body', '')
                            # Obtiene el ID del mensaje
                            message_id = message.get('id')
                            
                            # Verifica si el mensaje ya existe en la base de datos
                            if not Mensaje.objects.filter(wanidmensaje=message_id).exists():
                                # Si no existe, crea una nueva entrada en la base de datos
                                Mensaje.objects.create(
                                    textomensaje=text,  # Guarda el texto del mensaje
                                    wanidmensaje=message_id,  # Guarda el ID del mensaje
                                    json=json.dumps({  # Guarda el mensaje completo y los contactos en formato JSON
                                        'message': message,
                                        'contacts': contacts
                                    }),
                                    estado="recibido"  # Marca el estado del mensaje como "recibido"
                                )

            except Exception as e:
                # Imprime el error si ocurre una excepción
                print(f'Error al procesar la solicitud: {str(e)}')
                # Espera 2 segundos antes de intentar nuevamente para evitar sobrecargar el servidor
    

    # Método GET para iniciar la obtención de datos en un hilo separado
    def get(self, request, *args, **kwargs):
        # Crea un nuevo hilo que ejecutará la función fetch_data
        thread = threading.Thread(target=self.fetch_data)
        # Inicia el hilo
        thread.start()

        # Retorna una respuesta indicando que la obtención de datos ha comenzado
        return Response({'message': 'Obteniendo datos del webhook cada 2 segundos'}, status=status.HTTP_200_OK)

    # Método para obtener la fecha actual dinámica
    def get_current_date(self):
        current_time = datetime.now()
        if current_time.hour >= 18:
            current_time += timedelta(days=1)
        return current_time.strftime('%Y-%m-%d')

    # Método para calcular el tamaño dinámico
    def calculate_size(self):
        start_date = datetime(2024, 7, 12)  # Fecha de inicio
        current_date = datetime.now()
        days_diff = (current_date - start_date).days
        base_size = 4300
        increment_per_day = 150
        size = base_size + (days_diff * increment_per_day)
        return size


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
        url_api_facebook = settings.ENVIO_FACEBOOK_URL + \
            f"/{idusuario}/messages"

        # Obtener el token de acceso desde las configuraciones
        token_acceso = settings.TOKEN_ACESSO_FACEBOOK

        try:
            # Enviar la solicitud para guardar el mensaje en la API de Facebook
            response = requests.post(url_api_facebook, json=mensaje_body, params={
                                     'access_token': token_acceso})

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




#@api_view(['POST'])
#def crear_carpeta(request):
#    try:
        # Ruta donde se creará la carpeta temporal
#        carpeta_temporal = os.path.join(settings.BASE_DIR, 'temporal')
        
#        # Verificar si la carpeta ya existe, si no, crearla
#        if not os.path.exists(carpeta_temporal):
#            os.makedirs(carpeta_temporal)
#        
#        return Response({'mensaje': 'Carpeta temporal creada correctamente'}, status=status.HTTP_201_CREATED)
#    
#    except Exception as e:
#        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# Función para crear el JSON dinámico

def crear_json_archivos(archivos):
    json_archivos = []

    for archivo in archivos:
        extension = os.path.splitext(archivo)[1].lower()
        nombre = os.path.basename(archivo)
        archivo_info = {
            "link": archivo,
            "caption": f"Archivo en formato {extension[1:].upper()}",
        }

        if extension in [".jpg", ".jpeg", ".png"]:
            json_archivos.append({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": "9321021228",
                "type": "image",
                "image": archivo_info
            })
        elif extension == ".pdf":
            json_archivos.append({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": "9321021228",
                "type": "document",
                "document": {
                    "link": archivo,
                    "filename": nombre,
                    "caption": archivo_info["caption"]
                }
            })
        elif extension in [".mp4", ".avi", ".mov"]:
            json_archivos.append({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": "9321021228",
                "type": "video",
                "video": archivo_info
            })
        else:
            json_archivos.append({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": "9321021228",
                "type": "file",
                "file": {
                    "link": archivo,
                    "caption": archivo_info["caption"]
                }
            })

    return json_archivos




@api_view(['GET', 'POST'])
def subir_archivo(request):
    carpeta_temporal = os.path.join(settings.BASE_DIR, 'temporal')
    
    if request.method == 'POST':
        try:
            if not os.path.exists(carpeta_temporal):
                os.makedirs(carpeta_temporal)

            archivo = request.FILES.get('archivo')
            if not archivo:
                return Response({'error': 'No se ha proporcionado un archivo válido'}, status=status.HTTP_400_BAD_REQUEST)

            fs = FileSystemStorage(location=carpeta_temporal)
            filename = fs.save(archivo.name, archivo)

            archivo_url = f"http://127.0.0.1:8000/temporal/{filename}"

            json_resultado = crear_json_archivos([archivo_url])

            return Response(json_resultado, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'GET':
        try:
            if not os.path.exists(carpeta_temporal):
                return Response({'mensaje': 'No hay archivos en la carpeta temporal'}, status=status.HTTP_200_OK)

            archivos = os.listdir(carpeta_temporal)
            archivo_urls = [
                f"http://127.0.0.1:8000/temporal/{archivo}" for archivo in archivos
            ]

            json_resultado = crear_json_archivos(archivo_urls)

            return Response(json_resultado, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)