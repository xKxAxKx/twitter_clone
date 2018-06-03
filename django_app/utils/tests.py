from django.test import TestCase
from user.models import User

class TwitterTestCase(TestCase):

    def setUp(self):
        for i in range(0, 3):
            email = 'test_{}@test.com'.format(str(i))
            username = 'test_{}'.format(str(i))
            profile = 'test_{}'.format(str(i))
            User.objects.create(email=email,
                                username=username,
                                profile=profile)

        self.users = User.objects.all()
