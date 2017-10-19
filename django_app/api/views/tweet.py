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
from api.serializers.tweet import TweetSerializer, TweetPostSerializer
from api.models.tweet import Tweet
from api.models.user import Account
import json


# ツイート作成のView(POST)
class TweetPostView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Tweet.objects.all()
    serializer_class = TweetPostSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        request.data['user'] = request.user.id
        return super().create(request)


class TweetListPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'unit'


# 指定したユーザidのツイートもしくはフォローしているユーザーのツイートをGETする
class TweetListGetByUserIdView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    pagination_class = TweetListPagination
    queryset = Tweet.objects.all()

    def get(self, request):
        if "users" in request.GET:
            users = request.GET.get("users")

        try:
            tweet = Tweet.objects.select_related('user') \
                    .filter(user__in=users) \
                    .order_by('-id')
        except Tweet.DoesNotExist:
            raise Http404
        serializer = TweetSerializer(tweet, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


# 指定したidのツイートをGETする
class TweetGetByTweetIdView(generics.RetrieveAPIView):
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
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Tweet.objects.all()
    serializer_class = TweetPostSerializer

    def delete(self, request, tweet_id):
        try:
            tweet = Tweet.objects.select_related('user').get(id=tweet_id)
        except Tweet.DoesNotExist:
            raise Http404

        if request.user.id == tweet.user.id:
            tweet.delete()
            serializer = TweetSerializer(tweet)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            raise Http404
