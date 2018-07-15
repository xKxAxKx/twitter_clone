from utils.tests import TwitterTestCase
from rest_framework import status


class TestCreateUser(TwitterTestCase):

    def test_create_user(self):

        data = {"email": "test_1@example.com",
                "username": "test_1",
                "password": "password"}

        result = self.client.post('/api/user/register',
                                  data,
                                  format='json')

        self.assertEqual(result.status_code, status.HTTP_201_CREATED)
        self.assertEqual(result.data['email'], 'test_1@example.com')
        self.assertEqual(result.data['username'], 'test_1')

    def test_fail_create_user_invalid_email(self):
        data = {"email": "test_1example.com",
                "username": "test_1",
                "password": "password"}

        result = self.client.post('/api/user/register',
                                  data,
                                  format='json')
        self.assertEqual(result.status_code, status.HTTP_400_BAD_REQUEST)

    def test_fail_create_user_lack_username(self):
        data = {"email": "test_1example.com",
                "password": "password"}

        result = self.client.post('/api/user/register',
                                  data,
                                  format='json')
        self.assertEqual(result.status_code, status.HTTP_400_BAD_REQUEST)

    def test_fail_create_user_lack_password(self):
        data = {"email": "test_1example.com",
                "username": "test_1"}

        result = self.client.post('/api/user/register',
                                  data,
                                  format='json')
        self.assertEqual(result.status_code, status.HTTP_400_BAD_REQUEST)

    def test_fail_create_user_password_empty(self):
        data = {"email": "test_1example.com",
                "username": "test_1",
                "password": ""}

        result = self.client.post('/api/user/register',
                                  data,
                                  format='json')
        self.assertEqual(result.status_code, status.HTTP_400_BAD_REQUEST)
