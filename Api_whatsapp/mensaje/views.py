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

# Create your views here.


class MensajeViewset(viewsets.ModelViewSet):
    serializer_class = MensajeSerializer
    queryset = Mensaje.objects.all()

    
    def perform_create(self, serializer):
        # Obtener el tipo de mensaje enviado desde el frontend
        tipo_mensaje_codigo = self.request.data.get('tipoMensaje')
        wa_id = self.request.data.get('waid')  # Obtiene el wa_id desde la solicitud

        # Imprimir el tipo de mensaje recibido desde el frontend
        print("Tipo de mensaje recibido desde el frontend:", tipo_mensaje_codigo)
        print("wa_id recibido desde el frontend:", wa_id)

        try:
            # Buscar el tipo de mensaje en la base de datos
            tipo_mensaje = TipoMensaje.objects.get(codigo=tipo_mensaje_codigo)
            print("Tipo de mensaje encontrado en la base de datos:", tipo_mensaje)
        except TipoMensaje.DoesNotExist:
            print("Error: Tipo de mensaje con código {} no encontrado en la base de datos".format(tipo_mensaje_codigo))
            tipo_mensaje = None

        try:
            # Buscar el contacto por el wa_id
            contacto = Contacto.objects.get(waid=wa_id)
            print("Contacto encontrado en la base de datos:", contacto)
        except Contacto.DoesNotExist:
            print("Error: Contacto con wa_id {} no encontrado en la base de datos".format(wa_id))
            contacto = None  # O maneja la creación de un nuevo contacto aquí si es necesario

        # Guardar el mensaje con el tipo de mensaje y contacto encontrados
        serializer.save(tipomensaje=tipo_mensaje, contacto=contacto)



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