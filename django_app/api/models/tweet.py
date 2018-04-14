from django.db import models
from django.conf import settings


class Tweet(models.Model):
    tweet = models.CharField(max_length=140, blank=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name='ユーザー',
        on_delete=models.CASCADE
        )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.tweet

    @property
    def favorited_users(self):
        return Favorite.objects.filter(tweet=self)

    @property
    def parent_tweet(self):
        return Reply.objects.filter(child=self).values('parent')

    @property
    def child_tweets(self):
        return Reply.objects.filter(parent=self).values('child')


class Favorite(models.Model):
    tweet = models.ForeignKey(
        Tweet,
        related_name='favorited_tweet',
        on_delete=models.CASCADE
        )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='favorited_user',
        on_delete=models.CASCADE
        )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.created_at)


class Reply(models.Model):
    parent = models.ForeignKey(
        Tweet,
        related_name='parent_tweet',
        on_delete=models.CASCADE
        )
    child = models.ForeignKey(
        Tweet,
        related_name='child_tweet',
        on_delete=models.CASCADE
        )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.created_at)
