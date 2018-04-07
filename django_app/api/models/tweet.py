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
    favorite = models.ManyToManyField('Favorite',
                                      related_name='favorited_tweet',
                                      blank=True)
    parent = models.ManyToManyField('Reply',
                                    related_name='child_tweet',
                                    blank=True)
    child = models.ManyToManyField('Reply',
                                   related_name='parent_tweet',
                                   blank=True)

    def __str__(self):
        return self.tweet

    @property
    def fav_user(self):
        pass


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
