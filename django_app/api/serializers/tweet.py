from rest_framework import serializers
from api.serializers.user import AccountSerializer, FollowSerializer
from api.models.tweet import Tweet, Favorite, Reply
import sys


class TweetPostSerializer(serializers.ModelSerializer):
    user = AccountSerializer()

    class Meta:
        model = Tweet
        fields = ('tweet', 'user')


class TweetOnlySerializer(serializers.ModelSerializer):
    user = AccountSerializer()

    class Meta:
        model = Tweet
        fields = ('id', 'tweet', 'user', 'created_at')


class FavoriteUserSerializer(serializers.ModelSerializer):
    user = AccountSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ('id', 'user')


class ParentTweetSerializer(serializers.ModelSerializer):
    parent = TweetOnlySerializer()

    class Meta:
        model = Reply
        fields = ['parent']


class ChildTweetSerializer(serializers.ModelSerializer):
    child = TweetOnlySerializer()

    class Meta:
        model = Reply
        fields = ['child']


class TweetSerializer(serializers.ModelSerializer):
    user = AccountSerializer()
    favorited_user = FavoriteUserSerializer(source='favorited_tweet',
                                            many=True, read_only=True)
    parent = ParentTweetSerializer(source='child_tweet',
                                   many=True, read_only=True)
    children = ChildTweetSerializer(source='parent_tweet',
                                    many=True, read_only=True)

    class Meta:
        model = Tweet
        fields = ('id', 'tweet', 'user', 'favorited_user',
                  'parent', 'children', 'created_at')


class FavoriteSerializer(serializers.ModelSerializer):
    tweet = TweetSerializer(read_only=True)
    user = AccountSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ('id', 'tweet', 'user', 'created_at')
