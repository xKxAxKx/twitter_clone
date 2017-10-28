from rest_framework import serializers
from api.serializers.user import AccountSerializer, FollowSerializer
from api.models.tweet import Tweet, Favorite


class TweetOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = Tweet
        fields = ('id', 'tweet', 'user', 'created_at')


class FavoriteUserSerializer(serializers.ModelSerializer):
    user = AccountSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ('id', 'user')


class TweetSerializer(serializers.ModelSerializer):
    user = AccountSerializer()
    # コメントアウトしたけれど、ツイートの詳細を表示させる時にあったほうが良いかもなー
    # favorited_user = FavoriteUserSerializer(source='favorited_tweet',
    #                                         many=True, read_only=True)

    class Meta:
        model = Tweet
        # fields = ('id', 'tweet', 'user', 'favorited_user', 'created_at')
        fields = ('id', 'tweet', 'user', 'created_at')


class FavoriteSerializer(serializers.ModelSerializer):
    tweet = TweetSerializer(read_only=True)
    user = AccountSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ('id', 'tweet', 'user', 'created_at')
