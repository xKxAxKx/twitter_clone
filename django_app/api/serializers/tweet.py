from rest_framework import serializers
from api.serializers.user import AccountSerializer
from api.models.tweet import Tweet, Favorite


class TweetSerializer(serializers.ModelSerializer):
    user = AccountSerializer()

    class Meta:
        model = Tweet
        fields = ('id', 'tweet', 'user', 'created_at')


class TweetPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tweet
        fields = ('id', 'tweet', 'user', 'created_at')


class FavoriteSerializer(serializers.ModelSerializer):
    tweet = TweetSerializer(read_only=True)
    user = AccountSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ('id', 'tweet', 'user', 'created_at')
