import os
from rest_framework import status
from api.models.tweet import Tweet
from api.tests.test_utils import TestCaseBase
from api.tests.factory import AccountFactory, TweetFactory


class TestReply(TestCaseBase):
    api_url = '/api'

    def create_data(self):
        self.user_1 = AccountFactory(username='user_1')
        self.user_2 = AccountFactory(username='user_2')
        self.tweet_1_1 = TweetFactory(user=self.user_1)
        self.tweet_1_2 = TweetFactory(user=self.user_1)
        self.tweet_2_1 = TweetFactory(user=self.user_2)
        self.tweet_2_2 = TweetFactory(user=self.user_2)

    def test_reply(self):
        token = self.get_user_token()
        self.create_data()
        tweet_reply_url = os.path.join(self.api_url, 'tweet/post/?parent=')
        request_tweet = {'tweet': 'this is test tweet'}
        result = self.post(tweet_reply_url + str(self.tweet_1_1.id),
                           request_tweet,
                           token)
        self.assertEqual(status.HTTP_201_CREATED, result.status_code)
        # 返り値が冗長すぎるのでfixすること!
        self.assertEqual(self.tweet_1_1.id,
                         result.data['parent'][0]['parent']['id'])
        # 理想の返り返り値は以下になると思う
        # self.assertEqual(self.tweet_1_1.id, result.data['parent']['id'])

        tweet_get_url = os.path.join(self.api_url,
                                     'tweet',
                                     str(self.tweet_1_1.id))
        parent_result = self.get(tweet_get_url, None)
        self.assertEqual(result.data['id'],
                         parent_result.data['children'][0]['child']['id'])
        # ここもこうしたい
        # self.assertEqual(result.data['id'],
        #                  parent_result.data['children'][0]['id'])
