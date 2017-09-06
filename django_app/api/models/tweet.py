from django.db import models
from api.models.user import Account

class Tweet(models.Model):
    tweet = models.CharField(max_length=140, blank=False)
    user = models.ForeignKey(Account, verbose_name='ユーザー', related_name='posts_editor')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
