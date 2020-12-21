from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=16)
    nickname = models.CharField(max_length=30)
    friends = models.TextField(blank=True)

# description = models.TextField(blank=True)
# created_at = models.DateTimeField(auto_now_add=True)
# url = models.URLField()