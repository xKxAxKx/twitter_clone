from django.db import transaction
from django.http import Http404, JsonResponse
from django.conf import settings

from rest_framework import permissions, generics
from rest_framework_jwt.settings import api_settings
from rest_framework.response import Response
from rest_framework import status
from api.serializers.user import (AccountSerializer, FollowSerializer,
                                  PasswordChangeSerializer)
from api.models.user import Account, AccountManager, Follow

import jwt
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER


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
        login_user = self.queryset\
                         .get(email=self.request.user)
        serializer = AccountSerializer(login_user)

        return Response(data={
            'id': serializer.data['id'],
            'username': serializer.data['username'],
            'email': serializer.data['email'],
            'profile': serializer.data['profile'],
            'follow_list': serializer.data['follows'],
            'follower_list': serializer.data['followers'],
            'favorite_tweet': serializer.data['favorite_tweet']
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

    def put(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.get_object(),
                                           data=request.data,
                                           partial=True)
        if serializer.is_valid():
            instance = serializer.save()
            payload = jwt_payload_handler(instance)
            token = jwt.encode(payload, settings.SECRET_KEY) \
                       .decode('unicode_escape')
            response = JsonResponse({'token': token})
            response.status = 200
            return response
        else:
            response = JsonResponse({'errors': serializer.errors})
            response.status = 500
            return response


# パスワード更新のView(PUT)
class PasswordUpdateView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = PasswordChangeSerializer
    queryset = Account.objects.all()
    lookup_field = 'email'

    def update(self, request, *args, **kwargs):
        user = Account.objects.get(email=self.request.user)
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                user.set_password(serializer.data.get("new_password"))
                user.save()
                return Response("Success.", status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


# ユーザ削除のView(DELETE)
class AuthInfoDeleteView(generics.DestroyAPIView):
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


# 指定されたidのユーザ情報を返す
class UserInfoGetView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, user_id):
        try:
            user = Account.objects.get(id=user_id)
        except Account.DoesNotExist:
            raise Http404

        serializer = AccountSerializer(user)

        return Response(data={
            'id': serializer.data['id'],
            'username': serializer.data['username'],
            'email': serializer.data['email'],
            'profile': serializer.data['profile'],
            'follows': serializer.data['follows'],
            'followers': serializer.data['followers'],
            'favorite_tweets': serializer.data['favorite_tweets']
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
            Follow.objects.create(following=following, follower=request.user)
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
        already_follow = Follow.objects.get(follower=request.user.id,
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
