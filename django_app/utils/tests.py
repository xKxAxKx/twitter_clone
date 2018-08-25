from django.core import management
from django.conf import settings
from django.test import TestCase

class TwitterTestCase(TestCase):

    _token = ''

    def setUp(self):
        management.call_command('flush', interactive=False)
        settings.DEBUG = True

    def get_user_token(self):
        self._token = get_user_token(self.client)
        return self._token

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

    def put(self, url, data, token=None, **kwargs):
        if not token:
            token = self._token
        result = self.client.put(url, data=data,
                                 HTTP_AUTHORIZATION='JWT ' + token,
                                 content_type='application/json',
                                 format='json', **kwargs)
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

def get_user_token(client):
    create_account(client)
    response = client.post('/api/user/login',
                           {'email': 'test_user@example.com',
                            'password': 'password'},
                           format='json')
    token = response.data['token']
    return token

def create_account(client):
    url = "/api/user/register"
    data = {'email': 'test_user@example.com',
            'username': 'test_user',
            'password': 'password',
            'profile': 'profile'}
    client.post(url, data, format='json')