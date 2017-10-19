import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';
import { TweetService } from '../services/tweet.service';
import { UserStore } from '../stores/user.store';

@Component({
  selector: 'tweet-post',
  template: `
  <textarea [(ngModel)]="tweet"
    id="input_text"
    length="140"
    class="form-control"
    placeholder="What are you doing now?"
    required
  ></textarea><br>
  <button (click)="postTweet()" class="btn btn-success pull-right">tweet</button>
  `
})
export class TweetPostComponent {

  constructor (
    private tweetService: TweetService,
    private userStore: UserStore,
    private activatedRoute: ActivatedRoute,
  ){
    activatedRoute.params.subscribe((params: Params) => {
      if(params['user_id']){
        this.getFollowTweet = false;
      } else {
        this.getFollowTweet = true;
      }
    });
  }
  // トップページか否か
  getFollowTweet: boolean;
  // 入力されたツイートが入る
  tweet = '';

  postTweet() {
    let postData = {
      tweet: this.tweet,
      user: null,
    }
    this.tweetService.postTweet(postData, this.getFollowTweet);
    this.tweet = '';
  }
}
