import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';
import { TweetService } from '../services/tweet.service';
import { TweetStore } from '../stores/tweet.store';
import { UserStore } from '../stores/user.store';

@Component({
  selector: 'tweet-list',
  template: `
    <div *ngIf="tweetStore.tweetlist">
      <div *ngFor="let tweet of tweetStore.tweetlist">
        <div class="panel panel-primary">
          <div class="panel-body">
            <p>
              <a [routerLink]="['/user', tweet.user.id]">@{{ tweet.user.username }}</a>
              <span>{{ tweet.created_at | date: 'yyyy/MM/dd hh:mm:ss' }}</span>
              <span>Reply</span>
              <span>Retweet</span>
              <span>Favorite</span>
              <span *ngIf="tweet.user.id === userStore.loginUserInfo.id">Delete</span>
            </p>
            {{ tweet.tweet }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class TweetListComponent {

  constructor (
    private tweetService: TweetService,
    private tweetStore: TweetStore,
    private activatedRoute: ActivatedRoute,
    private userStore: UserStore,
  ){}

  users = null

  ngOnInit() {
  }

}
