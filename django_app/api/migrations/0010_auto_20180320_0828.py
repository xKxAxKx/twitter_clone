# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2018-03-20 08:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20171030_0924'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tweet',
            name='child',
            field=models.ManyToManyField(blank=True, related_name='parent_tweet', to='api.Reply'),
        ),
        migrations.AlterField(
            model_name='tweet',
            name='parent',
            field=models.ManyToManyField(blank=True, related_name='child_tweet', to='api.Reply'),
        ),
    ]
