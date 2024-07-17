from django.db import models
from usuario. models import Usuario

# Create your models here.
class Contacto(models.Model):
  usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, null=True, blank=True)  # Permite NULL y valores en blanco
  nombre = models.CharField(max_length=100, null=False, blank=True)  # No permite NULL ni valores en blanco
  apellidopaterno = models.CharField(max_length=100, null=False, blank=True)  # No permite NULL ni valores en blanco
  apellidomaterno = models.CharField(max_length=100, null=False, blank=True)  # No permite NULL ni valores en blanco
  fecharegistro = models.DateField(auto_now_add=True, null=False)
  # No permite NULL ni valores en blanco
  waid = models.CharField(max_length=100, null=False)  # No permite NULL ni valores en blanco
  nombreperfil = models.CharField(max_length=100, null=False)  # No permite NULL ni valores en blanco
  activo = models.BooleanField(default=True, null=False)  # No permite NULL ni valores en blanco

  class Meta:
    # Especifica el esquema donde quieres crear la tabla
    db_table = 'contacto'

  def __str__(self):
    return self.waid