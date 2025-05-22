from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Blog(models.Model):
    name= models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    body = models.TextField()
    image_url = models.URLField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

