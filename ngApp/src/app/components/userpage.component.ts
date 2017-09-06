import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { UserStore } from '../stores/user.store';

@Component({
  selector: 'userPage',
  template: `
  <div class="center">
    <div class="row">
      <div class="panel panel-primary" *ngIf="userStore.fetchUserInfo.id">
        <div class="panel-heading">@{{ userStore.fetchUserInfo.username }}</div>
        <div class="panel-body">{{ userStore.fetchUserInfo.profile }}</div>
      </div>
    <div>
  </div>
  `
})
export class UserpageComponent {

  user_id = '';

  constructor (
    private userStore: UserStore,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ){}

  ngOnInit() {
    // URLのパラメータのidを取得する
    this.activatedRoute.params.subscribe((params: Params) => {
        this.user_id = params['user_id'];
        this.userService.fetchUserInfo(this.user_id);
    });

  }
}
