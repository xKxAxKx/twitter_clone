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
        <div class="panel panel-primary">
          <div class="panel-heading">@{{ userStore.fetchUserInfo.username }}</div>
          <div class="panel-body">{{ userStore.fetchUserInfo.profile }}</div>
        </div>
      </div>
      <div class="col-sm-8">
        <tweet-post></tweet-post>
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
