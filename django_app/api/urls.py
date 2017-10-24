from django.conf.urls import include, url
from rest_framework import routers
from rest_framework_jwt.views import (obtain_jwt_token, refresh_jwt_token,
                                      verify_jwt_token)
from api.views.user import (AuthRegister, AuthInfoGetView, AuthInfoUpdateView,
                            AuthInfoDeleteView, UserInfoGetView,
                            FollowAddView, FollowRemoveView)
from api.views.tweet import (TweetPostView, TweetGetByTweetIdView,
                             TweetDeleteView, TweetListGetByUserIdView,
                             FavoriteTweetGetByUserIdView,
                             FavoriteTweetAddView)

urlpatterns = [
    url(r'^tweet/post/$', TweetPostView.as_view()),
    url(r'^tweet/(?P<tweet_id>\d+)$', TweetGetByTweetIdView.as_view()),
    url(r'^tweet/list/$', TweetListGetByUserIdView.as_view()),
    url(r'^tweet/delete/(?P<tweet_id>\d+)$', TweetDeleteView.as_view()),
    url(r'^favorite/get/(?P<user_id>\d+)$', FavoriteTweetGetByUserIdView.as_view()),
    url(r'^favorite/add/$', FavoriteTweetAddView.as_view()),
    url(r'^user/register/$', AuthRegister.as_view()),
    url(r'^user/mypage/$', AuthInfoGetView.as_view()),
    url(r'^user/(?P<user_id>\d+)$', UserInfoGetView.as_view()),
    url(r'^user/auth_update/$', AuthInfoUpdateView.as_view()),
    url(r'^user/delete/$', AuthInfoDeleteView.as_view()),
    url(r'^user/login/$', obtain_jwt_token),
    url(r'^user/token-refresh/$', refresh_jwt_token),
    url(r'^user/token-verify/$', verify_jwt_token),
    url(r'^user/follow/$', FollowAddView.as_view()),
    url(r'^user/remove/(?P<user_id>\d+)$', FollowRemoveView.as_view()),
]
