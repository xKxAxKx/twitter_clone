import os
import json

from rest_framework import status

from api.models import Tweet, Favorite, Reply, Account, Follow
from api.tests.test_utils import TestCaseBase
from api.tests.factory import AccountFactory, TweetFactory, FavoriteFactory


class TestFavorite(TestCaseBase):
    api_url = '/api'

    def create_data(self):
        self.user_1 = AccountFactory(username='user_1')
        self.user_2 = AccountFactory(username='user_2')
        self.tweet_1_1 = TweetFactory(user=self.user_1)
        self.tweet_1_2 = TweetFactory(user=self.user_1)
        self.tweet_2_1 = TweetFactory(user=self.user_2)
        self.tweet_2_2 = TweetFactory(user=self.user_2)

    def test_add_fav(self):
        token = self.get_user_token()
        self.create_data()
        fav_add_url = os.path.join(self.api_url,
                                   'favorite/add',
                                   str(self.tweet_1_1.id))
        result = self.post(fav_add_url,
                           None,
                           token)
        self.assertEqual(status.HTTP_201_CREATED, result.status_code)
