from rest_framework import serializers

from api.models.tweet import Tweet


class TweetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tweet
        fields = ('id', 'tweet', 'user', 'created_at')
