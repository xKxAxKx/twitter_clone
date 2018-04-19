# coding: utf-8
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.http import HttpResponse, Http404, HttpResponseBadRequest

from rest_framework import (authentication, permissions, generics,
                            status, viewsets, filters)
from rest_framework.response import Response

from api.serializers.tweet import (TweetSerializer, TweetMinimumSerializer,
                                   FavoriteSerializer, TweetPostSerializer)
from api.models.tweet import Tweet, Favorite, Reply
from api.models.user import Account, Follow
from api.utils.pagenation import TweetListPagenation


# ツイート作成のView(POST)
class TweetPostView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Tweet.objects.all()
    serializer_class = TweetPostSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        uri
            - /api/tweet/post/
        params
            - name: parent
              descrption: リプライ元のツイートのidを指定する
              required: False
              type: int
        """
        save_tweet = Tweet.objects.create(tweet=request.data['tweet'],
                                          user=request.user)
        parent_tweet_id = request.query_params.get('parent')
        if parent_tweet_id:
            try:
                parent_tweet = get_object_or_404(Tweet,
                                                 id=int(parent_tweet_id))
            except ValueError:
                return HttpResponseBadRequest(
                    content='パラメーターが不正です'
                )
            Reply.objects.create(parent=parent_tweet,
                                 child=save_tweet)
        tweet_serializer = TweetSerializer(save_tweet)
        return Response(tweet_serializer.data,
                        status=status.HTTP_201_CREATED)


# 指定したユーザidのツイートもしくはフォローしているユーザーのツイートをGETする
# todo:ページネーションして取得するようにする
class TweetListGetByUserIdView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer
    pagination_class = TweetListPagenation

    def get_queryset(self):
        """
        params
            - name: user
              description: userのidを指定し、そのユーザのツイート一覧を取得する
              required: True
              type: int
            - name: get_follow_tweet
              description: userで指定したユーザがフォローしているユーザのツイート一覧を取得する
              required: False
              type: boolean
        """
        target_user = self.request.GET.get('user', None)
        get_follow_tweet = self.request.GET.get('get_follo_tweet', False)

        users = []
        if target_user:
            target_user = target_user
            users.append(target_user)
        else:
            raise Http404

        if get_follow_tweet:
            follow_users = Follow.objects.filter(follower=target_user)
            for user in follow_users:
                users.append(user.following.id)

        try:
            tweet = (Tweet.objects
                          .select_related('user')
                          .prefetch_related('favorited_tweet',
                                            'child_tweet',
                                            'parent_tweet')
                          .filter(user__in=users)
                          .order_by('-id'))
            return tweet
        except Tweet.DoesNotExist:
            raise Http404


# 指定したidのツイートをGETする
class TweetGetByTweetIdView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = TweetSerializer

    def get(self, request, tweet_id):
        tweet = get_object_or_404(Tweet, id=tweet_id)
        serializer = TweetSerializer(tweet)

        return Response(serializer.data, status=status.HTTP_200_OK)


# ツイート削除のView(DELETE)
class TweetDeleteView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TweetMinimumSerializer

    def get_object(self, queryset=None):
        tweet_id = self.kwargs['tweet_id']
        tweet = get_object_or_404(Tweet,
                                  id=tweet_id,
                                  user__id=self.request.user.id)
        return tweet


# お気に入りツイート追加のView
class FavoriteTweetAddView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        tweet_id = int(kwargs['tweet_id'])

        #ツイート自体が存在するか確認
        tweet = get_object_or_404(Tweet, id=tweet_id)

        # すでにユーザがツイートをfavしていないか確認
        if tweet.favorited_users.filter(user=request.user):
            return Response(data={"message": "already fav!"},
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = FavoriteSerializer(Favorite.add_fav(tweet,
                                                             request.user))
            return Response(serializer.data, status=status.HTTP_201_CREATED)


# お気に入りツイート削除のView(DELETE)
class FavoriteTweetDeleteView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer

    def get_object(self, queryset=None):
        tweet_id = self.kwargs['tweet_id']
        fav_tweet = get_object_or_404(Favorite,
                                      tweet__id=tweet_id,
                                      user=self.request.user)
        return fav_tweet


# お気に入りツイートをユーザIDで取得
class FavoriteTweetGetByUserIdView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer

    def get(self, request, user_id):
        user = Account.objects.filter(id=user_id)
        try:
            tweet = (Tweet.objects
                          .filter(favorited_tweet__in=Favorite.objects.filter(user__in=user))
                          .order_by('-id'))
        except Favorite.DoesNotExist:
            raise Http404

        serializer = TweetSerializer(tweet, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
