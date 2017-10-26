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
from api.serializers.tweet import (TweetSerializer, TweetPostSerializer,
                                   FavoriteSerializer)
from api.models.tweet import Tweet, Favorite
from api.models.user import Account, Follow
import json


# ツイート作成のView(POST)
class TweetPostView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
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
        users = []
        if "users" in request.GET:
            users.append(request.GET.get("users"))

        if "get_follow_tweet" in request.GET:
            follow_users = Follow.objects.filter(follower__in=users)
            for user in follow_users:
                users.append(str(user.following.id))

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


# お気に入りツイートのView(POST)
class FavoriteTweetAddView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        #ツイート自体が存在するか確認
        try:
            tweet = Tweet.objects.get(id=request.data['id'])
        except Tweet.DoesNotExist:
            raise Http404

        # すでにユーザがツイートをfavしていないか確認
        try:
            already_fav = Favorite.objects.get(tweet=tweet, user=request.user)
            not_yet_fav = False
        except Favorite.DoesNotExist:
            not_yet_fav = True

        if not_yet_fav:
            add_fav = Favorite.objects.create(tweet=tweet, user=request.user)
            serializer = FavoriteSerializer(add_fav)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(data={"message": "already fav!"},
                            status=status.HTTP_400_BAD_REQUEST)


# お気に入りツイートをユーザIDで取得
class FavoriteTweetGetByUserIdView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer

    def get(self, request, user_id):
        user = Account.objects.filter(id=user_id)
        try:
            tweet = Favorite.objects.filter(user__in=user)
        except Favorite.DoesNotExist:
            raise Http404

        serializer = TweetSerializer(tweet, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
