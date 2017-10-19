from django.contrib import admin
from api.models import Account, Tweet, Follow


@admin.register(Account)
class Account(admin.ModelAdmin):
    list_display = ('username', 'email')


@admin.register(Tweet)
class Tweet(admin.ModelAdmin):
    list_display = ('tweet', 'user')


@admin.register(Follow)
class Follow(admin.ModelAdmin):
    list_display = ('followed_user', 'follow_user')
