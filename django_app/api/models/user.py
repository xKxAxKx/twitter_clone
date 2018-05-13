from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser, _user_has_perm
)
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.conf import settings


class AccountManager(BaseUserManager):
    def create_user(self, request_data, **kwargs):
        now = timezone.now()
        if not request_data['email']:
            raise ValueError('Users must have an email address.')

        if request_data.get('profile'):
            profile = request_data['profile']
        else:
            profile = ""

        user = self.model(
            username=request_data['username'],
            email=self.normalize_email(request_data['email']),
            is_active=True,
            last_login=now,
            date_joined=now,
            profile=profile
        )

        user.set_password(request_data['password'])
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password, **extra_fields):
        request_data = {
            'username': username,
            'email': email,
            'password': password
        }
        user = self.create_user(request_data)
        user.is_active = True
        user.is_staff = True
        user.is_admin = True
        # user.is_superuser = True
        user.save(using=self._db)
        return user


class Account(AbstractBaseUser):
    username = models.CharField(_('username'), max_length=30, unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    email = models.EmailField(verbose_name='email address',
                              max_length=255,
                              unique=True)
    profile = models.CharField(_('profile'), max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def user_has_perm(user, perm, obj):
        return _user_has_perm(user, perm, obj)

    def has_perm(self, perm, obj=None):
        return _user_has_perm(self, perm, obj=obj)

    def has_module_perms(self, app_label):
        return self.is_admin

    def get_short_name(self):
        return self.username

    @property
    def is_superuser(self):
        return self.is_admin

    @property
    def followers(self):
        # Userをフォローしているユーザを返す
        follow_object = Follow.objects.filter(following=self)
        follower_users = []
        for obj in follow_object:
            follower_users.append(obj.follower)
        return follower_users

    @property
    def follows(self):
        # Userがフォローしているユーザを返す
        follow_object = Follow.objects.filter(follower=self)
        follow_users = []
        for obj in follow_object:
            follow_users.append(obj.following)
        return follow_users

    @property
    def favorite_tweets(self):
        # Userのお気に入りのツイートを取得する
        pass

    class Meta:
        db_table = 'api_user'
        swappable = 'AUTH_USER_MODEL'


class Follow(models.Model):
    following = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='who_follows',
        on_delete=models.CASCADE
        )
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='who_is_followed',
        on_delete=models.CASCADE
        )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.created_at)
