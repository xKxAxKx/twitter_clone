import os
from rest_framework import status
from api.models.user import Account
from api.tests.test_utils import TestCaseBase
from api.tests.factory import AccountFactory, FollowFactory


class TestUserInfoGet(TestCaseBase):

    def create_data(self):
        self.user_1 = AccountFactory(username='user_1')
        self.user_2 = AccountFactory(username='user_2')
        self.user_3 = AccountFactory(username='user_3')
        self.follow_1 = FollowFactory(following=self.user_1,
                                      follower=self.user_2)
        self.follow_2 = FollowFactory(following=self.user_2,
                                      follower=self.user_1)
        self.follow_2 = FollowFactory(following=self.user_3,
                                      follower=self.user_1)

    def test_get_user_info(self):
        self.create_data()
        token = self.get_user_token()

        user_get_url = os.path.join(self.api_base_url,
                                    'user',
                                    str(self.user_1.id))
        result = self.get(user_get_url, None)
        self.assertStatus(status.HTTP_200_OK, result)
        self.assertEqual(result.data['id'], self.user_1.id)
        self.assertEqual(result.data['email'], self.user_1.email)
        self.assertEqual(len(result.data['followers']), 1)
        self.assertEqual(len(result.data['follows']), 2)
