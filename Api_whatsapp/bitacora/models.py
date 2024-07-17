from django.db import models
from mensaje.models import Mensaje

# Create your models here.
class Bitacora(models.Model):
    ESTADOS = (
        ('ENVIADO', 'Enviado'),
        ('ENTREGADO', 'Entregado'),
        ('LEIDO', 'Leído'),
        ('NO_ENCONTRADO', 'No encontrado'),
    )

    mensaje = models.ForeignKey(Mensaje, on_delete=models.CASCADE)
    estado = models.CharField(max_length=20, choices=ESTADOS)
    fecharegistro = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Especifica el esquema donde quieres crear la tabla
        db_table = 'bitacora'