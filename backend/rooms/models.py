from django.db import models
from users.models import User
from django.contrib.auth import get_user_model

# Create your models here.

class Room(models.Model):
    url = models.URLField()
    capacity = models.IntegerField()
    # owner = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    members = models.TextField(blank=True)
    owner = models.ForeignKey(get_user_model(), null = True, on_delete = models.CASCADE)
