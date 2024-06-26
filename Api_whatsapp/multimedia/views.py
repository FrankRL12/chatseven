import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
from django.http import HttpResponse
import os
from .models import MultimediaFile
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

class FacebookDataAPIView(APIView):
    def get(self, request, *args, **kwargs):
        access_token = 'EAAFlhalgZBNQBO2LAmDZAoJAfSh9eJMBor6cYY3h4AEDBRRjAYWXoyl5GCZAGjJ5M28NVdcoJwwWjAPv536RuTkcLYy7ZASJiu4Jd9UzYYEWdHewl7Yvhyk8drdJYoJHZAr3fZAZBT1TPYK1sjWVCQdLntAJUlkzUT63UU5yk6926lWQJr8mZB6TxYxB6ZARwVC5y'
        url = 'https://graph.facebook.com/v18.0/1868772050304132'

        headers = {
            'Authorization': f'Bearer {access_token}'
        }

        # Primera petición para obtener la URL de los datos binarios
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            return Response({'error': 'Failed to fetch data'}, status=status.HTTP_400_BAD_REQUEST)
        
        data = response.json()
        binary_data_url = data.get('url')  # Asegúrate de extraer correctamente la URL de los datos binarios

        if not binary_data_url:
            return Response({'error': 'No binary data URL found'}, status=status.HTTP_400_BAD_REQUEST)

        # Segunda petición para obtener los datos binarios
        binary_response = requests.get(binary_data_url, headers=headers)
        
        if binary_response.status_code != 200:
            return Response({'error': 'Failed to fetch binary data'}, status=status.HTTP_400_BAD_REQUEST)

        # Guardar el archivo en una carpeta dentro del proyecto
        file_path = os.path.join('media', 'document.jpeg')  # Ajusta la ruta de la carpeta según tu proyecto
        with open(file_path, 'wb') as f:
            f.write(binary_response.content)

        # Retorna la URL del archivo guardado
        return Response({'file_path': file_path}, status=status.HTTP_200_OK)


class WhatsAppWebhookAPIView(APIView):
    def get(self, request, *args, **kwargs):
        url = 'https://seven-brains.com/api/whatsapp-integration-service/client-api/v1/webhook/event'
        params = {
            'dateFrom': '2024-05-01',
            'dateTo': '2024-05-30',
            'from': 0,
            'size': 2000
        }

        response = requests.get(url, params=params)
        
        if response.status_code != 200:
            return Response({'error': 'Failed to fetch data from webhook'}, status=status.HTTP_400_BAD_REQUEST)
        
        payload = response.json()
        
        # Imprimir el payload completo para depuración
        print("Payload recibido del webhook:")
        print(json.dumps(payload, indent=4))
        
        return Response(payload, status=status.HTTP_200_OK)


class CombinedDataAPIView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener los datos de Facebook
        facebook_data_api = FacebookDataAPIView()
        facebook_response = facebook_data_api.get(request)
        facebook_data = facebook_response.data

        # Obtener los datos de WhatsApp
        whatsapp_data_api = WhatsAppWebhookAPIView()
        whatsapp_response = whatsapp_data_api.get(request)
        whatsapp_data = whatsapp_response.data

        # Combinar los datos
        combined_data = {
            'facebook_data': facebook_data,
            'whatsapp_data': whatsapp_data
        }

        return Response(combined_data, status=status.HTTP_200_OK)


class MultimediaDataAPIView(APIView):
    def get(self, request, *args, **kwargs):
        # Realizar la petición al webhook para obtener el JSON completo
        webhook_url = 'https://seven-brains.com/api/whatsapp-integration-service/client-api/v1/webhook/event'
        params = {
            'dateFrom': '2024-05-01',
            'dateTo': '2024-06-05',
            'from': 0,
            'size': 2800
        }

        # Token de autorización
        token = 'EAAFlhalgZBNQBO2LAmDZAoJAfSh9eJMBor6cYY3h4AEDBRRjAYWXoyl5GCZAGjJ5M28NVdcoJwwWjAPv536RuTkcLYy7ZASJiu4Jd9UzYYEWdHewl7Yvhyk8drdJYoJHZAr3fZAZBT1TPYK1sjWVCQdLntAJUlkzUT63UU5yk6926lWQJr8mZB6TxYxB6ZARwVC5y'

        headers = {
            'Authorization': f'Bearer {token}'
        }

        response = requests.get(webhook_url, params=params, headers=headers)
        
        if response.status_code != 200:
            return Response({'error': 'Failed to fetch data from webhook'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Obtener el JSON completo devuelto por el webhook
        webhook_json = response.json()

        # Lista para almacenar las URLs de los archivos multimedia
        multimedia_urls = []

        # Analizar el JSON para extraer las IDs de los archivos multimedia
        for event in webhook_json.get('webhookEventItem', []):
            payload = event.get('payload')
            payload_dict = json.loads(payload)
            entries = payload_dict.get('entry', [])
            for entry in entries:
                changes = entry.get('changes', [])
                for change in changes:
                    value = change.get('value', {})
                    messages = value.get('messages', [])
                    for message in messages:
                        if 'type' in message and message['type'] in ['image', 'sticker', 'video', 'audio', 'document']:
                            multimedia_id = message.get(message['type'], {}).get('id')
                            if multimedia_id:
                                # Concatenar la ID de multimedia a la URL
                                url = f"https://graph.facebook.com/v18.0/{multimedia_id}"
                                multimedia_response = requests.get(url, headers=headers)
                                if multimedia_response.status_code == 200:
                                    multimedia_data = multimedia_response.json()
                                    # Obtener la URL de descarga del archivo multimedia
                                    multimedia_url = multimedia_data.get('url')
                                    if multimedia_url:
                                        multimedia_urls.append((multimedia_id, multimedia_url))
                                        # Imprimir la URL en la consola
                                        print(f"URL del archivo multimedia: {multimedia_url}")

        # Lista para almacenar los nombres de los archivos multimedia guardados
        saved_files = []
        
        # Descargar y guardar cada archivo multimedia localmente y actualizar la base de datos
        for multimedia_id, multimedia_url in multimedia_urls:
            try:
                # Realizar la solicitud GET para obtener los datos binarios del archivo multimedia
                response = requests.get(multimedia_url, headers=headers)
                
                # Obtener el tipo MIME del archivo multimedia
                mime_type = response.headers.get('Content-Type')
                
                # Extensión del archivo basada en el tipo MIME
                extension = mime_type.split('/')[-1] if mime_type else 'unknown'
                
                # Nombre del archivo: archivo_multimedia_id.extension
                filename = f"archivo_{multimedia_id}.{extension}"
                
                # Guardar los datos binarios en un archivo local
                file_path = default_storage.save(filename, ContentFile(response.content))
                
                # Actualizar los campos en la base de datos
                multimedia_file = MultimediaFile.objects.get(multimedia_id=multimedia_id)
                multimedia_file.url = multimedia_url
                multimedia_file.archivos = filename  # Guardar solo el nombre del archivo
                multimedia_file.save()

                # Agregar el nombre del archivo a la lista de archivos guardados
                saved_files.append(filename)
                    
                # Imprimir la ruta del archivo guardado en la consola
                print(f"Archivo multimedia guardado: {filename}")
                
            except MultimediaFile.DoesNotExist:
                print(f"El archivo multimedia con ID {multimedia_id} no existe en la base de datos.")
            except Exception as e:
                # Manejar cualquier error que ocurra durante la descarga o guardado
                print(f"Error al descargar/guardar el archivo: {str(e)}")

        # Devolver la lista de nombres de archivos multimedia guardados como una respuesta de API
        return Response({'archivos_actualizados': saved_files}, status=status.HTTP_200_OK)