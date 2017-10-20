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
        return Response(data={
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'profile': request.user.profile,
            },
            status=status.HTTP_200_OK)


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


# ユーザフォロー追加のView(POST)
class FollowAddView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = FollowSerializer
    queryset = Follow.objects.all()

    def post(self, request, format=None):
        already_follow = Follow.objects.filter(follow_user=request.user.id,
                                            followed_user=request.data["id"])
        if already_follow:
            return Response(data={
                "error": "already follow"
                },
                status=status.HTTP_400_BAD_REQUEST)
        else:
            # あとでやる
            # follow_results = Follow.objects.create(
            #     follow_user=request.user.email,
            #     followed_user=request.data["email"]
            # )
            import pdb; pdb.set_trace()


# ユーザーフォロー解除のView(DELETE)
class FollowRemoveView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = FollowSerializer
