from unittest.mock import MagicMock, patch

from rest_framework import status

from api.models import Tweet, Favorite, Reply, Account, Follow
from api.tests.test_utils import TestCaseBase
from api.tests.factory import AccountFactory, TweetFactory


class TestTweetGet(TestCaseBase):

    def tweet_get(self):
        tweet_1 = TweetFactory()

        self.assertEqual(tweet_1.tweet, 'hogehoge')
