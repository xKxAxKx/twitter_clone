from utils.tests import TwitterTestCase
from rest_framework import status


class TestCreateUser(TwitterTestCase):

    def test_create_user(self):

        data = {"email": "test_user@example.com",
                "username": "test_user",
                "password": "password"}

        result = self.client.post('/api/user/register',
                                  data,
                                  format='json')

        self.assertEqual(result.status_code, status.HTTP_201_CREATED)
        self.assertEqual(result.data['email'], 'test_user@example.com')
        self.assertEqual(result.data['username'], 'test_user')
