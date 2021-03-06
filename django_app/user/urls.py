from django.conf.urls import url
from rest_framework_jwt.views import (obtain_jwt_token, refresh_jwt_token,
                                      verify_jwt_token)
from user.views import CreateUser, DeleteUser, GetMySelf, EditUserInfo

urlpatterns = [
    url(r'^login$', obtain_jwt_token),
    url(r'^token_refresh$', refresh_jwt_token),
    url(r'^token_verify$', verify_jwt_token),
    url(r'^register$', CreateUser.as_view()),
    url(r'^delete$', DeleteUser.as_view()),
    url(r'^myself$', GetMySelf.as_view()),
    url(r'^edit_user_info', EditUserInfo.as_view()),
]