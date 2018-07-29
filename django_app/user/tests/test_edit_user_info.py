from utils.tests import TwitterTestCase
from rest_framework import status


class TestEditUserInfo(TwitterTestCase):
    def test_edit_user_info(self):
        data = {"profile": "profile2"}
        self.token = self.get_user_token()
        result = self.put(url='/api/user/edit_user_info',
                          data=data,
                          token=self.token)
 