from utils.tests import TwitterTestCase
from rest_framework import status


class TestLoginUser(TwitterTestCase):

    def setUp(self):
        super(TwitterTestCase, self).setUp()
        self.client.post('/api/user/register',
                         {"email": "test_1@example.com",
                          "username": "test",
                          "password": "password"},
                         format='json')

    def test_login_user(self):
        data = {"email": "test_1@example.com",
                "password": "password"}
        result = self.client.post('/api/user/login',
                                  data,
                                  format='json')
        self.assertEqual(result.status_code, status.HTTP_200_OK)
        self.assertEqual('token' in result.data.keys(), True)