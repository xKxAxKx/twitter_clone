from django.contrib import admin
from api.models import Account, Tweet

admin.site.register(Account)

@admin.register(Tweet)
class Tweet(admin.ModelAdmin):
    pass
