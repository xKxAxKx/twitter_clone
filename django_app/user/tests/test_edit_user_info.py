import json
from utils.tests import TwitterTestCase
from rest_framework import status


class TestEditUserInfo(TwitterTestCase):
    def test_edit_user_info(self):
        data = json.dumps({"profile": "profile2"})
        self.token = self.get_user_token()
        result = self.put(url='/api/user/edit_user_info',
                          data=data,
                          token=self.token)

        self.assertEqual(result.status_code, status.HTTP_200_OK)
        self.assertEqual(result.data["profile"], "profile2")
