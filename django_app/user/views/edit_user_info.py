from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.serializers import UserBaseSerializer


class EditUserInfo(APIView):

    def put(self, request):
        user = request.user

        if request.data.get('username'):
            user.username = request.data.get('username')

        if request.data.get('profile'):
            user.profile = request.data.get('profile')

        # Todo:emailの場合はjwtトークンを再発行するようにする
        # if request.data.get('email'):
        #     user.email = request.data.get('email')

        user.save()

        serializer = UserBaseSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
