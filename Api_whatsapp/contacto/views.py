from django.shortcuts import render
from rest_framework import viewsets, status
from .models import Contacto
from .serializers import ContactoSerializer
from rest_framework.response import Response

# Create your views here.
class ContactoViewset(viewsets.ModelViewSet):
    serializer_class = ContactoSerializer
    queryset = Contacto.objects.all()

    def create(self, request, *args, **kwargs):
        waid = request.data.get('waid')
        
        # Verificar si el waid ya está registrado
        if Contacto.objects.filter(waid=waid).exists():
            return Response(
                {"error": "El waid que intenta registrar ya está registrado."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Si el waid no existe, proceder a crear el registro
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)