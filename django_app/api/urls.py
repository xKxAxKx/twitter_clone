from django.conf.urls import include, url
from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token
from api.views.user import (AuthRegister, AuthInfoGetView, AuthInfoUpdateView, AuthInfoDeleteView)

urlpatterns = [
    # ユーザー関連
    url(r'^user/register/$', AuthRegister.as_view()),
    url(r'^user/mypage/$', AuthInfoGetView.as_view()),
    url(r'^user/auth_update/$', AuthInfoUpdateView.as_view()),
    url(r'^user/delete/$', AuthInfoDeleteView.as_view()),
    url(r'^user/login/$', obtain_jwt_token),
    url(r'^user/token-refresh/$', refresh_jwt_token),
    url(r'^user/token-verify/$', verify_jwt_token),
]
