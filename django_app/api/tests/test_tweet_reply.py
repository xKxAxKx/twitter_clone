import os
from rest_framework import status
from api.models.tweet import Tweet
from api.tests.test_utils import TestCaseBase
from api.tests.factory import AccountFactory, TweetFactory


class TestReply(TestCaseBase):

    def create_data(self):
        self.user_1 = AccountFactory(username='user_1')
        self.tweet_1_1 = TweetFactory(user=self.user_1)

    def test_reply(self):
        token = self.get_user_token()
        self.create_data()

        tweet_get_url = os.path.join(self.api_base_url,
                                     'tweet',
                                     str(self.tweet_1_1.id))
        parent = self.get(tweet_get_url, None)
        tweet_reply_url = os.path.join(self.api_base_url, 'tweet/post/')
        request_data = {'tweet': 'this is test tweet',
                        'parent_tweet': parent.data}
        result = self.post(tweet_reply_url,
                           request_data,
                           token)
        self.assertEqual(status.HTTP_201_CREATED, result.status_code)
        self.assertEqual(self.tweet_1_1.id,
                         result.data['parent'][0]['parent']['id'])
        # todo:以下でテスト通るようにやっていく
        # self.assertEqual(self.tweet_1_1.id, result.data['parent']['id'])

        tweet_get_url = os.path.join(self.api_base_url,
                                     'tweet',
                                     str(self.tweet_1_1.id))
        parent_result = self.get(tweet_get_url, None)
        self.assertEqual(result.data['id'],
                         parent_result.data['children'][0]['child']['id'])
        # todo:以下でテスト通るようにやっていく
        # self.assertEqual(result.data['id'],
        #                  parent_result.data['children'][0]['id'])
