import factory
from factory.fuzzy import FuzzyText

from api.models import Tweet, Favorite, Account, Follow


class AccountFactory(factory.DjangoModelFactory):
    class Meta:
        model = Account

    username = FuzzyText()
    first_name = FuzzyText()
    last_name = FuzzyText()
    email = factory.Sequence(lambda n: f'exsample_{n}@email.com')
    profile = FuzzyText()
    is_active = True
    is_staff = False
    is_admin = False


class TweetFactory(factory.DjangoModelFactory):
    class Meta:
        model = Tweet

    tweet = FuzzyText()
    user = factory.SubFactory(AccountFactory)


class FavoriteFactory(factory.DjangoModelFactory):
    class Meta:
        model = Favorite

    tweet = factory.SubFactory(TweetFactory)
    user = factory.SubFactory(AccountFactory)


class FollowFactory(factory.DjangoModelFactory):
    class Meta:
        model = Follow

    following = factory.SubFactory(AccountFactory)
    follower = factory.SubFactory(AccountFactory)
