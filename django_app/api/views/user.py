from django.contrib.auth import authenticate
from rest_framework import authentication, permissions, generics
from rest_framework_jwt.settings import api_settings
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from django.db import transaction
from django.http import HttpResponse, Http404

from rest_framework import status, viewsets, filters
from rest_framework.views import APIView

from api.serializers.user import AccountSerializer, FollowSerializer
from api.models.user import Account, AccountManager, Follow


# ユーザ作成のView(POST)
class AuthRegister(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    @transaction.atomic
    def post(self, request, format=None):
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ログインユーザ情報取得のView(GET)
class AuthInfoGetView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get(self, request, format=None):
        instance = self.queryset\
                       .get(email=self.request.user)
        follow_list = [{
            'id': data.following.id,
            'email': data.following.email,
            'username': data.following.username,
        } for data in instance.who_is_followed.all()]

        follower_list = [{
            'id': data.follower.id,
            'email': data.follower.email,
            'username': data.follower.username,
        } for data in instance.who_follows.all()]

        return Response(data={
            'id': instance.id,
            'username': instance.username,
            'email': instance.email,
            'profile': instance.profile,
            'follow_list': follow_list,
            'follower_list': follower_list,
            },
            status=status.HTTP_200_OK)


# ユーザ情報更新のView(PUT)
class AuthInfoUpdateView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = AccountSerializer
    lookup_field = 'email'
    queryset = Account.objects.all()

    def get_object(self):
        try:
            instance = self.queryset.get(email=self.request.user)
            return instance
        except Account.DoesNotExist:
            raise Http404


# ユーザ削除のView(DELETE)
class AuthInfoDeleteView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated)
    serializer_class = AccountSerializer
    lookup_field = 'email'
    queryset = Account.objects.all()

    def get_object(self):
        try:
            instance = self.queryset.get(email=self.request.user)
            return instance
        except Account.DoesNotExist:
            raise Http404


# 指定されたidのユーザ情報を返す
class UserInfoGetView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, user_id):
        try:
            user = Account.objects.get(id=user_id)
        except Account.DoesNotExist:
            raise Http404

        return Response(data={
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'profile': user.profile,
            },
            status=status.HTTP_200_OK)


# ユーザフォロー追加のView(POST)
class FollowAddView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = FollowSerializer
    queryset = Follow.objects.all()

    def post(self, request, format=None):
        already_follow = Follow.objects.filter(follower=request.user.id,
                                               following=request.data["id"])
        if already_follow:
            return Response(data={
                "message": "already follow"
                },
                status=status.HTTP_400_BAD_REQUEST)
        else:
            following = Account.objects.get(id=request.data["id"])
            follow_results = Follow.objects.create(
                following=following,
                follower=request.user,
            )
            return Response(data={
                "message": "followed!"
                },
                status=status.HTTP_200_OK)


# ユーザーフォロー解除のView(DELETE)
class FollowRemoveView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = FollowSerializer
    queryset = Follow.objects.all()

    def delete(self, request, user_id):
        already_follow = Follow.objects.filter(follower=request.user.id,
                                               following=user_id)
        if already_follow:
            already_follow.delete()
            return Response(data={
                "message": "Removed!"
                },
                status=status.HTTP_200_OK)
        else:
            return Response(data={
                "error": "not followed user"
                },
                status=status.HTTP_400_BAD_REQUEST)
