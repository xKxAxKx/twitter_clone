from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include('api.urls')),
]

if settings.DEBUG:
    from rest_framework_swagger.views import get_swagger_view
    schema_view = get_swagger_view(title='TWITTER CLONE API LIST',
                                   patterns=urlpatterns)
    urlpatterns.extend([
        url(r'^swagger/?$', schema_view),
    ])
