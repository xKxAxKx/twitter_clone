from rest_framework import serializers
from user.models import User


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'profile', 'password')

    def create(self, validated_data):
        return User.objects.create_user(request_data=validated_data)
