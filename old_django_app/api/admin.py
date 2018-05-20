from django.contrib import admin
from api.models import Account, Tweet, Follow, Favorite, Reply


@admin.register(Account)
class Account(admin.ModelAdmin):
    list_display = ('username', 'email')


@admin.register(Tweet)
class Tweet(admin.ModelAdmin):
    list_display = ('tweet', 'user')


@admin.register(Follow)
class Follow(admin.ModelAdmin):
    list_display = ('following', 'follower')


@admin.register(Favorite)
class Favorite(admin.ModelAdmin):
    list_display = ('tweet', 'user')


@admin.register(Reply)
class Reply(admin.ModelAdmin):
    list_display = ('parent', 'child')
