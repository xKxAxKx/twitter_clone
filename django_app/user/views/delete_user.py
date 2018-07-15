import json
from rest_framework.response import Response
from rest_framework.views import APIView


class DeleteUser(APIView):

    def delete(self, request):
        result = request.user.delete()
        return Response(json.dumps({'data': result}))
