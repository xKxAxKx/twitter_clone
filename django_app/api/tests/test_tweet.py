import os
from unittest.mock import MagicMock, patch

from rest_framework import status

from api.models import Tweet, Favorite, Reply, Account, Follow
from api.tests.test_utils import TestCaseBase
from api.tests.factory import AccountFactory, TweetFactory


class TestTweetGet(TestCaseBase):
    api_url = 'http://127.0.0.1:8000/api'

    def create_data(self):
        self.user_1 = AccountFactory(username='user_1')
        self.user_2 = AccountFactory(username='user_2')
        self.tweet_1_1 = TweetFactory(user=self.user_1)
        self.tweet_1_2 = TweetFactory(user=self.user_1)
        self.tweet_2_1 = TweetFactory(user=self.user_2)
        self.tweet_2_2 = TweetFactory(user=self.user_2)

    def test_tweet_get(self):
        self.create_data()
        tweet_get_url = os.path.join(self.api_url,
                                     'tweet',
                                     str(self.tweet_1_1.id))

        print(tweet_get_url)
        result = self.get(tweet_get_url, data=None)
        self.assertStatus(status.HTTP_200_OK, result)
