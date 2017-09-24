import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';
import { TweetService } from '../services/tweet.service';
import { TweetStore } from '../stores/tweet.store';

@Component({
  selector: 'tweet-list',
  template: `
    <div *ngFor="let tweet of tweetStore.tweetlist;">
      <div class="panel panel-primary">
        <div class="panel-body">
          <p>
            @{{ tweet.user.username }}
            <span>{{ tweet.created_at | date: 'yyyy/MM/dd hh:mm:ss' }}</span>
          </p>
          {{ tweet.tweet }}
        </div>
      </div>
    </div>
  `
})
export class TweetListComponent {

  constructor (
    private tweetService: TweetService,
    private tweetStore: TweetStore,
    private activatedRoute: ActivatedRoute,
  ){}

  users = null

  ngOnInit() {
    this.tweetStore.tweetlist = {};
    // URLのパラメータのidを取得する
    this.activatedRoute.params.subscribe((params: Params) => {
        this.users = params['user_id'];
    });

    if (this.users) {
      this.tweetService.getTweetByUserIds(this.users);
    } else {
      console.log("ユーザーページじゃないよ");
    }

  }

}
