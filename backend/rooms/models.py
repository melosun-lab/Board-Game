from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

class Room(models.Model):
    name = models.CharField(max_length=30, blank=True)
    url = models.URLField()
    capacity = models.IntegerField()
    members = models.TextField(blank=True)
    owner = models.ForeignKey(get_user_model(), null = True, on_delete = models.CASCADE)
    game = models.CharField(max_length=30, blank=True)
