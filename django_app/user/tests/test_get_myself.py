from utils.tests import TwitterTestCase
from rest_framework import status


class TestGetMySelf(TwitterTestCase):

    def test_get_myself(self):
        self.token = self.get_user_token()
        result = self.get(url='/api/user/myself',
                          data=None,
                          token=self.token)

        self.assertEqual(result.status_code, status.HTTP_200_OK)
        self.assertEqual(result.data['email'], 'test_user@example.com')
        self.assertEqual(result.data['profile'], 'profile')

    def test_get_myself_no_token(self):
        result = self.get(url='/api/user/myself',
                          data=None,
                          token='')
        self.assertEqual(result.status_code, status.HTTP_401_UNAUTHORIZED)