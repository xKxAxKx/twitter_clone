import os
from rest_framework import status
from api.tests.test_utils import TestCaseBase
from api.tests.factory import AccountFactory, TweetFactory


class TestTweet(TestCaseBase):

    def create_data(self):
        self.user_1 = AccountFactory(username='user_1')
        self.tweet_1_1 = TweetFactory(user=self.user_1)

    def test_tweet_get(self):
        self.get_user_token()
        self.create_data()
        tweet_get_url = os.path.join(self.api_base_url,
                                     'tweet',
                                     str(self.tweet_1_1.id))

        result = self.get(tweet_get_url, None)
        self.assertStatus(status.HTTP_200_OK, result)
        self.assertEqual(self.tweet_1_1.tweet, result.data['tweet'])

    def test_tweet_post_success(self):
        token = self.get_user_token()
        tweet_post_url = os.path.join(self.api_base_url, 'tweet/post/')
        request_tweet = {'tweet': 'this is test tweet'}
        result = self.post(tweet_post_url,
                           request_tweet,
                           token)
        self.assertEqual(status.HTTP_201_CREATED, result.status_code)

    def test_tweet_post_failed(self):
        token = None
        tweet_post_url = os.path.join(self.api_base_url, 'tweet/post/')
        request_tweet = {'tweet': 'this is test tweet'}
        result = self.post(tweet_post_url,
                           request_tweet,
                           token)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, result.status_code)
