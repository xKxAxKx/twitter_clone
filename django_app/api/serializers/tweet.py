from rest_framework import serializers
from api.serializers.user import AccountSerializer
from api.models.tweet import Tweet


class TweetSerializer(serializers.ModelSerializer):
    user = AccountSerializer()

    class Meta:
        model = Tweet
        fields = ('id', 'tweet', 'user', 'created_at')


class TweetPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tweet
        fields = ('id', 'tweet', 'user', 'created_at')
