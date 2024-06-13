# views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.decorators import action
from django.contrib.auth import authenticate
from .serializers import UsuarioSerializer
from .models import Usuario

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='authenticate', url_name='authenticate')
    def authenticate_user(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"message": "Faltan campos requeridos."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            if user.is_active:
                user_data = {
                    "message": "Acceso concedido",
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,  # Puedes incluir más campos si es necesario
                }
                return Response(user_data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "No tienes acceso, usuario inactivo."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"message": "Credenciales incorrectas."}, status=status.HTTP_401_UNAUTHORIZED)
