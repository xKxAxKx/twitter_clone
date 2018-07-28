from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.serializers import UserBaseSerializer


class GetMySelf(APIView):

    def get(self, request):
        serializer = UserBaseSerializer(request.user)
        return Response(serializer.data,
                        status=status.HTTP_200_OK)
