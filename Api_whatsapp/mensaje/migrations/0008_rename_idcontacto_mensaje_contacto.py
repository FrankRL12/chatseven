# Generated by Django 4.2.3 on 2024-06-12 22:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mensaje', '0007_remove_mensaje_idcontacto_mensaje_idcontacto'),
    ]

    operations = [
        migrations.RenameField(
            model_name='mensaje',
            old_name='idcontacto',
            new_name='contacto',
        ),
    ]
