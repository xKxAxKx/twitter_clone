import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { TweetService } from '../services/tweet.service';
import { UserService } from '../services/user.service';
import { UserStore } from '../stores/user.store';

@Component({
  selector: 'userPage',
  template: `
  <div class="center">
    <div class="row">
      <div class="col-sm-4">
        <user-panel></user-panel>
      </div>
      <div class="col-sm-8">
        <tweet-list></tweet-list>
      </div>
    <div>
  </div>
  `
})
export class UserpageComponent {

  constructor (
    private userStore: UserStore,
    private userService: UserService,
    private tweetService: TweetService,
    private activatedRoute: ActivatedRoute,
  ){
    activatedRoute.params.subscribe((params: Params) => {
        this.userService.fetchUserInfo(params['user_id']);
        this.tweetService.getTweetByUserIds(params['user_id'], false);
    });
  }
}
