# Generated by Django 4.2.3 on 2024-06-11 18:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('catalago', '0002_alter_catalogo_table_alter_estadomensaje_table_and_more'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='catalogo',
            table='catalogo',
        ),
        migrations.AlterModelTable(
            name='estadomensaje',
            table='estadomensaje',
        ),
        migrations.AlterModelTable(
            name='tipomensaje',
            table='tipomensaje',
        ),
    ]