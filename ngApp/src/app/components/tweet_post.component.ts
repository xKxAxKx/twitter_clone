import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';
import { TweetService } from '../services/tweet.service';
import { UserStore } from '../stores/user.store';
import { TweetStore } from '../stores/tweet.store';
import { ITweet, ITweets, IModal } from '../models';
import { Modal }  from '../utils/modal';

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
  <button *ngIf="reply===true" (click)="postReply()" class="btn btn-success pull-right">reply</button>
  `
})
export class TweetPostComponent {

  @Input() parent_tweet: any;
  @Input() isFavList: boolean;
  reply: boolean;
  getFollowTweet: boolean;
  tweet: string;
  user_id: number;

  constructor (
    private tweetService: TweetService,
    private userStore: UserStore,
    private tweetStore: TweetStore,
    private activatedRoute: ActivatedRoute,
  ){
    activatedRoute.params.subscribe((params: Params) => {
      if(params['user_id']){
        this.user_id = params['user_id'];
        this.getFollowTweet = false;
      } else {
        this.user_id = null;
        this.getFollowTweet = true;
      }
    });
  }

  get dialogData(): IModal {
    return this.tweetStore.modalData;
  }

  ngOnInit(){
    this.reply = false;
    this.tweet = '';

    if(this.parent_tweet) {
      this.reply = true;
      this.tweet = `@${this.parent_tweet.user.username} `;
    }
  }

  postTweet() {
    let postData = {
      tweet: this.tweet,
      user: null,
    }
    this.tweetService.postTweet(postData, this.getFollowTweet);
    this.tweet = '';
    this.parent_tweet = {};
  }

  postReply() {
    let postData = {
      tweet: this.tweet,
      parent_tweet: this.parent_tweet,
      user: null,
    }
    this.closeModal();
  }

  closeModal() {
    /*
     * モーダルの内容を設定
     */
    this.dialogData.isShow = false;
    this.dialogData.type = 'dialog';
    this.dialogData.title = '';
    this.dialogData.tweet = {};
    this.dialogData.okBtnAble = false;
    this.dialogData.cancelBtnAble = false;

  }
}
