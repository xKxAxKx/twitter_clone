from unittest.mock import MagicMock, patch

from rest_framework import status

from api.models import Tweet, Favorite, Reply, Account, Follow
from api.tests.test_utils import TestCaseBase
from api.tests.factory import AccountFactory, TweetFactory


class TestTweetGet(TestCaseBase):

    def create_test_data(self):
        user_1 = AccountFactory(username='user_1')
        user_2 = AccountFactory(username='user_2')
        tweet_1_1 = TweetFactory(user=user_1)
        tweet_1_2 = TweetFactory(user=user_1)
        tweet_2_1 = TweetFactory(user=user_2)
        tweet_2_2 = TweetFactory(user=user_2)

    def test_tweet_get(self):
        user_1 = AccountFactory(username='user_1')
        tweet_1_1 = TweetFactory(user=user_1)
        import pdb; pdb.set_trace()
        self.assertEqual(tweet_1.tweet, 'hogehoge')
