from django.db import models
from catalago.models import TipoMensaje
from usuario.models import Usuario
from contacto.models import Contacto

# Create your models here.


class Mensaje(models.Model):
    idusuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, blank=True, null=True)
    contacto = models.ForeignKey(Contacto, on_delete=models.CASCADE, blank=True, null=True)
    textomensaje = models.CharField(max_length=10000, null=False, blank=True)
    wanidmensaje = models.CharField(max_length=100, null=False, blank=True)
    fecharegistro = models.DateTimeField(auto_now_add=True, blank=True)
    json= models.TextField(null=True, blank=True)
    tipomensaje = models.ForeignKey(TipoMensaje, on_delete=models.CASCADE, blank=True , null=True)
    estado = models.CharField(max_length=10, null=True, blank=True) 
    
    class Meta:
        # Especifica el esquema donde quieres crear la tabla
        db_table = 'mensaje'
