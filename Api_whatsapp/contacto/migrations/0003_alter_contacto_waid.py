# Generated by Django 4.2.3 on 2024-06-08 05:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contacto', '0002_alter_contacto_table'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contacto',
            name='waid',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
