import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';

@Component({
  selector: 'tweet-post',
  template: `
  <input [(ngModel)]="tweet"
    id="input_text"
    type="textarea"
    length="140"
    class="form-control"
    placeholder="tweet"
    required
  ><br>
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
