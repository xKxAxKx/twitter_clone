from django.db import models
from utils.models import TimeStampModel
from user.models import User

class Post(TimeStampModel):
    content = models.CharField(max_length=140, blank=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )