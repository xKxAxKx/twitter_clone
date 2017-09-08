from django.db import models
from django.conf import settings

class Tweet(models.Model):
    tweet = models.CharField(max_length=140, blank=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name='ユーザー',
        related_name='posts_editor',
        on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.tweet
