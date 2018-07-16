from utils.tests import TwitterTestCase
from rest_framework import status
from user.models import User


class TestCreateUser(TwitterTestCase):

    def test_delete_user(self):
        token = self.get_user_token()
        self.assertEqual(User.objects.filter(email='test_user@example.com').exists(),
                         True)
        result = self.delete('/api/user/delete',
                             None,
                             token)
        self.assertEqual(result.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.filter(email='test_user@example.com').exists(),
                         False)

    def test_fail_delete_user(self):
        token = self.get_user_token()
        User.objects.get(email='test_user@example.com').delete()
        result = self.delete('/api/user/delete',
                             None,
                             token)
        self.assertEqual(result.status_code, status.HTTP_401_UNAUTHORIZED)
