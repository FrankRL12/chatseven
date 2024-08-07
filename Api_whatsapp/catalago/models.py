from django.db import models

# Create your models here.
class EstadoMensaje(models.Model):
    codigo = models.CharField(max_length=100, null=False)
    descripcion = models.CharField(max_length=255, null=False)
    formatosalida = models.CharField(max_length=100, null=False)
    activo = models.BooleanField(default=True, null=False)
    fecharegistro = models.DateField(auto_now_add=True, null=False)
    editable = models.BooleanField(default=True, null=False)

    class Meta:
        # Especifica el esquema donde quieres crear la tabla
        db_table = 'estadoMensaje'
      

class TipoMensaje(models.Model):
    codigo = models.CharField(max_length=100, null=False)
    descripcion = models.CharField(max_length=255, null=False)
    formatosalida = models.CharField(max_length=100, null=False)
    activo = models.BooleanField(default=True, null=False)
    fecharegistro = models.DateField(auto_now_add=True, null=False)
    editable = models.BooleanField(default=True, null=False)

    class Meta:
        # Especifica el esquema donde quieres crear la tabla
        db_table = 'tipoMensaje'
        



    def __str__(self):
        return self.codigo

class Catalogo(models.Model):
    codigo = models.CharField(max_length=100, null=False)
    descripcion = models.CharField(max_length=255, null=False)
    formatosalida = models.CharField(max_length=100, null=False)
    activo = models.BooleanField(default=True, null=False)
    fecharegistro = models.DateField(auto_now_add=True, null=False)
    editable = models.BooleanField(default=True, null=False)

    class Meta:
        # Especifica el esquema donde quieres crear la tabla
        db_table = 'catalago'
        
