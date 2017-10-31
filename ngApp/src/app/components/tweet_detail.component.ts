import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { TweetService } from '../services/tweet.service';
import { TweetStore } from '../stores/tweet.store';
import { UserService } from '../services/user.service';
import { UserStore } from '../stores/user.store';

@Component({
  selector: 'tweetDetail',
  template: `
  <div class="center">
    <div class="row">
      <div class="col-sm-4">
        <user-panel></user-panel>
      </div>
      <div class="col-sm-8">
        <h2>Tweet Detail</h2>
      </div>
    <div>
  </div>
  `
})
export class TweetDetailComponent {

  constructor (
    private userStore: UserStore,
    private userService: UserService,
    private tweetService: TweetService,
    private tweetStore: TweetStore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ){
    activatedRoute.params.subscribe((params: Params) => {
      console.log(params['tweet_id']);
    });
  }

}
