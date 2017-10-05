import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';
import { UserStore } from '../stores/user.store';
import { UserService } from '../services/user.service';

@Component({
  selector: 'user-panel',
  template: `
    <div class="panel panel-primary">
      <div class="panel-heading">@{{ userInfo.username }}</div>
      <div class="panel-body">{{ userInfo.profile }}</div>
    </div>
  `
})
export class UserPanelComponent {

  constructor (
    private mainService: MainService,
    private userStore: UserStore,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ){

  }

  params_user_id: number;
  userInfo: any = {};

  ngDoCheck() {
  }

  ngOnInit() {
    this.params_user_id = null;

    this.activatedRoute.params.subscribe((params: Params) => {
        this.params_user_id = params['user_id'];
    });

    if(this.params_user_id) {
      this.userService.fetchUserInfo(this.params_user_id);
      setTimeout(() => {
        this.userInfo = this.userStore.fetchUserInfo;
      }, 0);
    } else {
      setTimeout(() => {
        this.userInfo = this.userStore.loginUserInfo;
        console.log(this.userInfo);
      }, 0);
    }
  }

}
