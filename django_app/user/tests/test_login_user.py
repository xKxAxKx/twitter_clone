from utils.tests import TwitterTestCase

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
        import pdb;
        pdb.set_trace()