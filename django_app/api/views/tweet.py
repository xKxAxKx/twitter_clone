from django.contrib.auth import authenticate
from rest_framework import authentication, permissions, generics
from rest_framework_jwt.settings import api_settings
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from django.db import transaction
from django.http import HttpResponse, Http404

from rest_framework import status, viewsets, filters
from rest_framework.views import APIView

from api.serializers.tweet import TweetSerializer
from api.models.tweet import Tweet

# ツイート作成のView(POST)
class TweetPostView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = TweetSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


# 指定したユーザのツイートをGETする
class TweetListGetView(generics.RetrieveAPIView):
    pass


# 指定したidのツイートをGETする
class TweetGetView(generics.RetrieveAPIView):
    pass


# ツイート削除のView(DELETE)
class TweetDeleteView(generics.DestroyAPIView):
    pass
