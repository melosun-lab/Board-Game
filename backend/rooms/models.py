from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

class Room(models.Model):
    name = models.CharField(max_length=30, blank=True)
    url = models.URLField()
    capacity = models.IntegerField()
    members = models.ManyToManyField(get_user_model(), related_name = "memberset")
    owner = models.ForeignKey(get_user_model(), null = True, on_delete = models.CASCADE, related_name = "ownerset")
    game = models.CharField(max_length=30, blank=True)
