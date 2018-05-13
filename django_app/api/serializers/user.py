from rest_framework import serializers
from api.models.user import Account, AccountManager, Follow


class AccountBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('id', 'username', 'email', 'profile')


class FollowSerializer(serializers.ModelSerializer):
    following = AccountBaseSerializer(read_only=True)
    follower = AccountBaseSerializer(read_only=True)

    class Meta:
        model = Follow
        fields = ('id', 'following', 'follower')


class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    follows = AccountBaseSerializer(many=True, read_only=True)
    followers = AccountBaseSerializer(many=True, read_only=True)
    favorite_tweet = FollowSerializer(source='favorited_user',
                                      many=True, read_only=True)

    class Meta:
        model = Account
        fields = ('id', 'username', 'email', 'profile', 'follows', 'password',
                  'followers', 'favorite_tweet')

    def create(self, validated_data):
        return Account.objects.create_user(request_data=validated_data)


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
