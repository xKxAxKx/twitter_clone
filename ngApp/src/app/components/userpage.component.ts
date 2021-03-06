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
      <div *ngIf="isTweetlist === true && isFavList === false" class="col-sm-8">
        <h2>@{{userStore.fetchUserInfo.username}}'s tweets</h2>
        <tweet-list></tweet-list>
      </div>
      <div *ngIf="isTweetlist === true && isFavList === true" class="col-sm-8">
        <h2>@{{userStore.fetchUserInfo.username}}'s Favorite</h2>
        <tweet-list [isFavList]='isFavList'></tweet-list>
      </div>
      <div *ngIf="isTweetlist === false">
        <follow-follower [title]='followFollowerTitle'></follow-follower>
      </div>
    <div>
  </div>
  `
})
export class UserpageComponent {
  isTweetlist: boolean;
  isFavList: boolean;
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

      this.isFavList = false;
      if(this.router.url.includes('followers')) {
        this.isTweetlist = false;
        this.followFollowerTitle = "Follower List";
      } else if(this.router.url.includes('follows')) {
        this.isTweetlist = false;
        this.followFollowerTitle = "Follow List";
      } else if(this.router.url.includes('fav_list')) {
        this.isTweetlist = true;
        this.isFavList = true;
      } else {
        this.isTweetlist = true;
      }

      if(this.isFavList){
        this.userService.FetchFavoriteTweet(params['user_id'], false);
      } else {
        this.tweetService.getTweetByUserIds(params['user_id'], false);
      }
    });
  }

}
