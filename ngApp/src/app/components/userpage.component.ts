import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { UserStore } from '../stores/user.store';

@Component({
  selector: 'userPage',
  template: `
  <div class="center">
    <div class="row">
      <div class="col-sm-4">
        <user-panel></user-panel>
      </div>
      <div class="col-sm-8">
        <tweet-list></tweet-list>
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

  params_user_id: number;

  ngOnInit() {
    this.setUserInfo()
  }

  // user-panelに渡すためにパラメータのユーザ情報を取得する
  setUserInfo() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.params_user_id = params['user_id'];
    });

    this.userService.fetchUserInfo(this.params_user_id);
  }


}
