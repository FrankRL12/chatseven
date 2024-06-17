# Generated by Django 4.2.3 on 2024-06-13 20:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mensaje', '0010_mensaje_estado'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mensaje',
            name='estado',
            field=models.CharField(blank=True, choices=[('recibido', 'Recibido'), ('enviado', 'Enviado')], max_length=10, null=True),
        ),
    ]
