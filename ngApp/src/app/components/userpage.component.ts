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
      <div *ngIf="is_follow_follower_list === false" class="col-sm-8">
        <tweet-list></tweet-list>
      </div>
      <div *ngIf="is_follow_follower_list === true">
        <follow-follower [title]='followFollowerTitle'></follow-follower>
      </div>
    <div>
  </div>
  `
})
export class UserpageComponent {
  is_follow_follower_list: boolean;
  followFollowerTitle: string;

  constructor (
    private userStore: UserStore,
    private userService: UserService,
    private tweetService: TweetService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ){
    activatedRoute.params.subscribe((params: Params) => {
        this.userService.fetchUserInfo(params['user_id']);
        this.tweetService.getTweetByUserIds(params['user_id'], false);
    });
  }

  ngOnInit() {
    if(this.router.url.includes('follower_list')) {
      this.is_follow_follower_list = true;
      this.followFollowerTitle = "Follower List";
    } else if(this.router.url.includes('follow_list')) {
      this.is_follow_follower_list = true;
      this.followFollowerTitle = "Follow List";
    } else {
      this.is_follow_follower_list = false;
    }
  }
}
