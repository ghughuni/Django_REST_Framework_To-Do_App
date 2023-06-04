from django.db import models
from django.utils import timezone

# Create your models here.

class Task(models.Model):
  created_at = models.DateTimeField(default=timezone.now)
  title = models.CharField(max_length=200)
  completed = models.BooleanField(default=False, blank=True, null=True)
      
  def __str__(self):
    return self.title