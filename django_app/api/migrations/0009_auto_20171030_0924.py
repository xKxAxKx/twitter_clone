# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-10-30 09:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_auto_20171030_0836'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reply',
            name='base',
        ),
        migrations.RemoveField(
            model_name='reply',
            name='reply',
        ),
        migrations.AddField(
            model_name='reply',
            name='child',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='child_tweet', to='api.Tweet'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='reply',
            name='parent',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='parent_tweet', to='api.Tweet'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='tweet',
            name='child',
            field=models.ManyToManyField(blank=True, related_name='child_tweet', to='api.Reply'),
        ),
        migrations.AlterField(
            model_name='tweet',
            name='parent',
            field=models.ManyToManyField(blank=True, related_name='parent_tweet', to='api.Reply'),
        ),
    ]
