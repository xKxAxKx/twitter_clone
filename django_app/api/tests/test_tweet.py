import os
from rest_framework import status
from api.tests.test_utils import TestCaseBase
from api.tests.factory import AccountFactory, TweetFactory


class TestTweet(TestCaseBase):
    api_url = '/api'

    def create_data(self):
        self.user_1 = AccountFactory(username='user_1')
        self.user_2 = AccountFactory(username='user_2')
        self.tweet_1_1 = TweetFactory(user=self.user_1)
        self.tweet_1_2 = TweetFactory(user=self.user_1)
        self.tweet_2_1 = TweetFactory(user=self.user_2)
        self.tweet_2_2 = TweetFactory(user=self.user_2)

    def test_tweet_get(self):
        self.get_user_token()
        self.create_data()
        tweet_get_url = os.path.join(self.api_url,
                                     'tweet',
                                     str(self.tweet_1_1.id))

        result = self.get(tweet_get_url, None)
        self.assertStatus(status.HTTP_200_OK, result)
        self.assertEqual(self.tweet_1_1.tweet, result.data['tweet'])

    def test_tweet_post_success(self):
        token = self.get_user_token()
        tweet_post_url = os.path.join(self.api_url, 'tweet/post/')
        request_tweet = {'tweet': 'this is test tweet'}
        result = self.post(tweet_post_url,
                           request_tweet,
                           token)
        self.assertEqual(status.HTTP_201_CREATED, result.status_code)

    def test_tweet_post_failed(self):
        token = None
        tweet_post_url = os.path.join(self.api_url, 'tweet/post/')
        request_tweet = {'tweet': 'this is test tweet',
                         'parent_tweet': None}
        result = self.post(tweet_post_url,
                           request_tweet,
                           token)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, result.status_code)

    def test_tweet_delete_success(self):
        token = self.get_user_token()
        tweet_post_url = os.path.join(self.api_url, 'tweet/post/')
        request_tweet = {'tweet': 'this is test tweet'}
        post_result = self.post(tweet_post_url,
                                request_tweet,
                                token)
        self.assertEqual(status.HTTP_201_CREATED, post_result.status_code)

        tweet_delete_url = os.path.join(self.api_url,
                                        'tweet/delete/',
                                        str(post_result.data['id']))
        del_result = self.delete(tweet_delete_url, None, token)
        self.assertEqual(status.HTTP_204_NO_CONTENT,
                         del_result.status_code)

        tweet_get_url = os.path.join(self.api_url,
                                     'tweet',
                                     str(post_result.data['id']))
        get_result = self.get(tweet_get_url, None)
        self.assertEqual(status.HTTP_404_NOT_FOUND,
                         get_result.status_code)

    def test_tweet_delete_failed(self):
        self.create_data()
        token = self.get_user_token()
        tweet_post_url = os.path.join(self.api_url, 'tweet/post/')
        request_tweet = {'tweet': 'this is test tweet',
                         'parent_tweet': None}
        post_result = self.post(tweet_post_url,
                                request_tweet,
                                token)
        self.assertEqual(status.HTTP_201_CREATED, post_result.status_code)
        tweet_delete_url = os.path.join(self.api_url,
                                        'tweet/delete/',
                                        str(self.tweet_1_1.id))
        del_result = self.delete(tweet_delete_url, None, token)
        self.assertEqual(status.HTTP_404_NOT_FOUND,
                         del_result.status_code)
