import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { TweetService } from '../services/tweet.service';

@Injectable()
export class TweetStore {

  // 取得したツイートのリスト
  tweetlist: any = {};

  constructor (
    private tweetService: TweetService,
  ) {
    this.tweetService.fetchTweetListSubjct.subscribe(
      (res) => {
        this.tweetlist = res.json();
    });
  }
}
