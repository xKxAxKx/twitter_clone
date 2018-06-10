from django.core import management
from django.conf import settings
from django.test import TestCase

class TwitterTestCase(TestCase):

    _token = ''

    def setUp(self):
        management.call_command('flush', interactive=False)
        settings.DEBUG = True
        # todo:ここにユーザ作成とトークン作成を追加する

    def assertStatus(self, status_expected, result, msg=''):
        if status_expected != result.status_code:
            if hasattr(result, 'data'):
                if 'detail' in result.data:
                    msg += ' ' + result.data['detail']
                else:
                    msg += ' ' + str(result.data)
        self.assertEqual(status_expected, result.status_code, msg)

    def post(self, url, data, token=None, **kwargs):
        if not token:
            token = self._token
        result = self.client.post(url, data=data,
                                  HTTP_AUTHORIZATION='JWT ' + token,
                                  format='json', **kwargs)
        return result

    def put(self, url, data, token=None):
        if not token:
            token = self._token
        result = self.client.put(url, data=data,
                                 HTTP_AUTHORIZATION='JWT ' + token,
                                 format='json')
        return result

    def get(self, url, data, token=None, **kwargs):
        if not token:
            token = self._token
        result = self.client.get(url, data=data,
                                 HTTP_AUTHORIZATION='JWT ' + token,
                                 format='json', **kwargs)
        return result

    def delete(self, url, data, token=None):
        if not token:
            token = self._token
        result = self.client.delete(url, data=data,
                                    HTTP_AUTHORIZATION='JWT ' + token,
                                    format='json')
        return result
