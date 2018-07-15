from utils.tests import TwitterTestCase
from rest_framework import status
from user.models import User


class TestCreateUser(TwitterTestCase):

    def test_delete_user(self):
        token = self.get_user_token()
        self.assertEqual(User.objects.filter(email='test_user@example.com').exists(),
                         True)
        # Todo:self.client.deleteで作り直してみる
        result = self.delete('/api/user/delete',
                             None,
                             token)
        self.assertEqual(result.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.filter(email='test_user@example.com').exists(),
                         False)
