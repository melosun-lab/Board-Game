# Generated by Django 3.1.4 on 2021-01-09 03:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_user_is_confirmed'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='is_confirmed',
        ),
    ]
