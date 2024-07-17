from django.db import models

# Create your models here.
class MultimediaFile(models.Model):
    # Campo para almacenar el ID del archivo multimedia
    multimedia_id = models.CharField(max_length=255, unique=True)
    # Campo para almacenar la URL del archivo multimedia
    url = models.URLField(max_length=255)
    # Campo para almacenar el archivo multimedia
    archivos = models.FileField(upload_to='media/')


    class Meta:
        # Especifica el esquema donde quieres crear la tabla
        db_table = 'multimedia'

        
    def __str__(self):
        return f"{self.multimedia_id}"