from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from api.models.user import Account, AccountManager, Follow


class AccountDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('id', 'username', 'profile')


class FollowSerializer(serializers.ModelSerializer):
    following = AccountDataSerializer(read_only=True)
    follower = AccountDataSerializer(read_only=True)

    class Meta:
        model = Follow
        fields = ('id', 'following', 'follower')


class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    follows = FollowSerializer(source='who_is_followed',
                               many=True, read_only=True)
    followers = FollowSerializer(source='who_follows',
                                 many=True, read_only=True)

    class Meta:
        model = Account
        fields = ('id', 'username', 'email', 'profile', 'password', 'follows',
                  'followers')

    def create(self, validated_data):
        return Account.objects.create_user(request_data=validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        else:
            instance = super().update(instance, validated_data)
        instance.save()
        return instance
