from django.conf.urls import include, url
from django.contrib import admin
from django.urls import path

API_PATH = 'api'

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^{}/user'.format(API_PATH), include('user.urls')),
]
