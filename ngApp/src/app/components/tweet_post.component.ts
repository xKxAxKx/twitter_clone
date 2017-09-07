import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';

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

  // 入力されたツイートが入る
  tweet = '';

  postTweet() {
    console.log(this.tweet);
  }
}
