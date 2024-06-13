# Generated by Django 4.2.3 on 2024-06-06 17:44

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MultimediaFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('multimedia_id', models.CharField(max_length=255, unique=True)),
                ('url', models.URLField(max_length=255)),
                ('archivos', models.FileField(upload_to='media/')),
            ],
            options={
                'db_table': 'Multimedia',
            },
        ),
    ]
