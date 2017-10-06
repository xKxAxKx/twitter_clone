import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';
import { UserStore } from '../stores/user.store';

@Component({
  selector: 'main',
  template: `
  <div class="center">
    <div class="row">
      <div class="col-sm-4">
        <user-panel></user-panel>
      </div>
      <div class="col-sm-8">
        <div class="tweet_post">
          <tweet-post></tweet-post>
        </div>
        <div style="margin-top: 50px;"class="tweet_list">
          <tweet-list></tweet-list>
        </div>
      </div>
    <div>
  </div>
  `
})
export class MainComponent {
  constructor (
    private mainService: MainService,
    private userStore: UserStore,
    private activatedRoute: ActivatedRoute,
  ){}
}
