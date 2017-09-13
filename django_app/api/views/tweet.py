from django.contrib.auth import authenticate
from rest_framework import authentication, permissions, generics
from rest_framework_jwt.settings import api_settings
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from django.db import transaction
from django.http import HttpResponse, Http404
from rest_framework.pagination import PageNumberPagination
from rest_framework import status, viewsets, filters
from rest_framework.views import APIView
from api.serializers.tweet import TweetSerializer
from api.models.tweet import Tweet


# ツイート作成のView(POST)
class TweetPostView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TweetSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class TweetListPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'unit'


# 指定したユーザのツイートをGETする
# object.all()でfilterでユーザidを指定すればいいか
class TweetListGetView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    pagination_class = TweetListPagination

    def get(self, request, *args, **kwargs):
        try:
            tweet = Tweet.objects.all()
        except Tweet.DoesNotExist:
            raise Http404
        serializer = TweetSerializer(tweet)

        return Response(serializer.data, status=status.HTTP_200_OK)


# 指定したidのツイートをGETする
class TweetGetByIdView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, tweet_id):
        try:
            tweet = Tweet.objects.select_related('user').get(id=tweet_id)
        except Tweet.DoesNotExist:
            raise Http404

        serializer = TweetSerializer(tweet)

        return Response(serializer.data, status=status.HTTP_200_OK)


# ツイート削除のView(DELETE)
class TweetDeleteView(generics.DestroyAPIView):
    pass
