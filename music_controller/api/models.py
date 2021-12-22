from django.db import models
import random
import string
# Create your models here.


def generate_code():
    len = 6
    print(Room.objects.all())
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=len))
        if Room.objects.filter(code=code).count() == 0:
            return code


class Room(models.Model):
    code = models.CharField(default=generate_code, unique=True, max_length=50)
    host = models.CharField(unique=True, max_length=50)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=50, null=True)
