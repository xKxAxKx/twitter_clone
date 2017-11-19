import json

from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.http import HttpResponse, Http404

from rest_framework import authentication, permissions, generics, status, viewsets, filters
from rest_framework_jwt.settings import api_settings
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView

from api.serializers.tweet import (TweetSerializer, TweetOnlySerializer,
                                   FavoriteSerializer, TweetPostSerializer)
from api.serializers.user import AccountSerializer
from api.models.tweet import Tweet, Favorite, Reply
from api.models.user import Account, Follow


# ツイート作成のView(POST)
class TweetPostView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Tweet.objects.all()
    serializer_class = TweetPostSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        request.data['user'] = request.user.id
        request_user = Account.objects.get(id=request.user.id)
        save_tweet_query = Tweet.objects.create(tweet=request.data['tweet'],
                                         user=request_user)
        if request.data['parent_tweet']:
            parent_tweet = Tweet.objects.get(id=request.data['parent_tweet']['id'])
            reply_query = Reply.objects.create(parent=parent_tweet,
                                               child=save_tweet_query)
        tweet_serializer = TweetSerializer(save_tweet_query)
        return Response(tweet_serializer.data, status=status.HTTP_200_OK)


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
            tweet = (Tweet.objects
                          .select_related('user')
                          .filter(user__in=users)
                          .order_by('-id'))
        except Tweet.DoesNotExist:
            raise Http404
        serializer = TweetSerializer(tweet, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


# 指定したidのツイートをGETする
class TweetGetByTweetIdView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, tweet_id):
        tweet = get_object_or_404(Tweet, id=tweet_id)
        serializer = TweetSerializer(tweet)

        return Response(serializer.data, status=status.HTTP_200_OK)


# ツイート削除のView(DELETE)
class TweetDeleteView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Tweet.objects.all()
    serializer_class = TweetOnlySerializer

    def delete(self, request, tweet_id):
        tweet = get_object_or_404(Tweet, id=tweet_id)

        if request.user.id == tweet.user.id:
            tweet.delete()
            serializer = TweetSerializer(tweet)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            raise Http404


# お気に入りツイート追加のView
class FavoriteTweetAddView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        #ツイート自体が存在するか確認
        tweet = get_object_or_404(Tweet, id=request.data['id'])

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


# お気に入りツイート削除のView(DELETE)
class FavoriteTweetDeleteView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer

    def delete(self, request, tweet_id):
        #ツイート自体が存在するか確認
        tweet = get_object_or_404(Tweet, id=tweet_id)

        # ユーザがツイートをFavしているか確認
        try:
            already_fav = Favorite.objects.get(tweet=tweet, user=request.user)
            not_yet_fav = False
        except Favorite.DoesNotExist:
            not_yet_fav = True

        if not_yet_fav:
            return Response(data={"message": "not_yet fav!"},
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            already_fav.delete()
            return Response(data={"message": "success delete fav!"},
                            status=status.HTTP_200_OK)


# お気に入りツイートをユーザIDで取得
class FavoriteTweetGetByUserIdView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer

    def get(self, request, user_id):
        user = Account.objects.filter(id=user_id)
        try:
            tweet = Tweet.objects \
                         .filter(favorited_tweet__in=Favorite.objects.filter(user__in=user))\
                         .order_by('-id')
        except Favorite.DoesNotExist:
            raise Http404

        serializer = TweetSerializer(tweet, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
