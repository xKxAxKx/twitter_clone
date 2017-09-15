from rest_framework import serializers
from api.serializers.user import AccountSerializer
from api.models.tweet import Tweet


class TweetSerializer(serializers.ModelSerializer):
    user = AccountSerializer()

    class Meta:
        model = Tweet
        fields = ('id', 'tweet', 'user', 'created_at')

    def create(self, validated_data):
        return Tweet.objects.create(request_data=validated_data)
