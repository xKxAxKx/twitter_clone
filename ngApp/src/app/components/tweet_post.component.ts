import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';
import { TweetService } from '../services/tweet.service';
import { UserStore } from '../stores/user.store';
import { ITweet, ITweets, IModal } from '../models';

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
  <button *ngIf="reply===false" (click)="postTweet()" class="btn btn-success pull-right">tweet</button>
  <button *ngIf="reply===true" (click)="postTweet()" class="btn btn-success pull-right">reply</button>
  `
})
export class TweetPostComponent {

  @Input() parent_tweet: any;
  reply: boolean = false;

  getFollowTweet: boolean;
  tweet: string;

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

  ngOnInit(){
    if(this.parent_tweet) {
      this.reply = true;
      this.tweet = `@${this.parent_tweet.user.username} `;
    } else {
      this.tweet = '';
    }

  }
  // 入力されたツイートが入
  postTweet() {
    let postData = {
      tweet: this.tweet,
      user: null,
    }
    this.tweetService.postTweet(postData, this.getFollowTweet);
    this.tweet = '';
    this.parent_tweet = {};
  }
}
