from utils.tests import TwitterTestCase


class TestCreateUser(TwitterTestCase):

    def test_create_user(self):

        data = {"email": "test_user@example.com",
                "username": "test_user",
                "password": "password"}

        import pdb;
        pdb.set_trace()
