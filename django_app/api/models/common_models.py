from django.db import models


class BaseModel(models.Model):
    """
    ベースモデル
    """
    created = models.DateTimeField(auto_now_add=True, null=False)
    updated = models.DateTimeField(auto_now=True, null=False)

    class Meta(object):
        abstract = True
