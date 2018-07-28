from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.serializers import UserMySelfSerializer


class GetMySelf(APIView):

    def get(self, request):
        serializer = UserMySelfSerializer(request.user)
        return Response(serializer.data,
                        status=status.HTTP_200_OK)
