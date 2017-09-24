import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';
import { TweetService } from '../services/tweet.service';
import { TweetStore } from '../stores/tweet.store';

@Component({
  selector: 'tweet-list',
  template: `
  <div class="panel panel-primary">
    <div class="panel-body">
      ツイートが入る
    </div>
  </div>
  <div class="panel panel-primary">
    <div class="panel-body">
      ツイートが入る
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
