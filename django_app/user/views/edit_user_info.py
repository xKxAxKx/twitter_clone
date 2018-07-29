from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.serializers import UserBaseSerializer


class EditUserInfo(APIView):

    def put(self, request):
        import pdb;
        pdb.set_trace()
        serializer = UserBaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
