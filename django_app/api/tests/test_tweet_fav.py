import os
from rest_framework import status
from api.tests.test_utils import TestCaseBase
from api.tests.factory import AccountFactory, TweetFactory, FavoriteFactory


class TestFavorite(TestCaseBase):

    def create_data(self):
        self.user_1 = AccountFactory(username='user_1')
        self.tweet_1_1 = TweetFactory(user=self.user_1)
        self.tweet_1_2 = TweetFactory(user=self.user_1)

    def test_add_fav(self):
        token = self.get_user_token()
        self.create_data()
        fav_add_url = os.path.join(self.api_base_url,
                                   'favorite/add',
                                   str(self.tweet_1_1.id))
        result = self.post(fav_add_url,
                           None,
                           token)
        self.assertEqual(status.HTTP_201_CREATED, result.status_code)

        # 既にfavしたツイートにfavして失敗する
        result = self.post(fav_add_url,
                           None,
                           token)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, result.status_code)

    def test_delete_fav(self):
        token = self.get_user_token()
        self.create_data()
        fav_add_url = os.path.join(self.api_base_url,
                                   'favorite/add',
                                   str(self.tweet_1_1.id))
        self.post(fav_add_url, None, token)

        fav_delete_url = os.path.join(self.api_base_url,
                                      'favorite/delete',
                                      str(self.tweet_1_1.id))
        success_result = self.delete(fav_delete_url, None, token)
        self.assertEqual(status.HTTP_204_NO_CONTENT,
                         success_result.status_code)

        # favしていないツイートにdeleteして失敗する
        fav_delete_url = os.path.join(self.api_base_url,
                                      'favorite/delete',
                                      str(self.tweet_1_2.id))
        failed_result = self.delete(fav_delete_url, None, token)
        self.assertEqual(status.HTTP_404_NOT_FOUND,
                         failed_result.status_code)
