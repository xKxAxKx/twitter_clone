import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';
import { UserStore } from '../stores/user.store';
import { UserService } from '../services/user.service';
import { Modal }  from '../utils/modal';

import { IModal } from '../models';

@Component({
  selector: 'follow-follower',
  template: `
  <h2>{{title}}</h2>
  <div class="col-sm-4">
    <div class="panel panel-primary">
      <div class="panel-heading">
        @hogehoge
      </div>
      <div class="panel-body">
        <p class="user-profile-in-panel">プロフィールが入る</p>
        <div class="ProfileCardStats">
          <a href="">0 Follow</a>
          <a href="">0 Follower</a>
        </div>
      </div>
    </div>
  </div>
  <div class="col-sm-4">
    <div class="panel panel-primary">
      <div class="panel-heading">
        @hogehoge
      </div>
      <div class="panel-body">
        <p class="user-profile-in-panel">プロフィールが入る</p>
        <div class="ProfileCardStats">
          <a href="">0 Follow</a>
          <a href="">0 Follower</a>
        </div>
      </div>
    </div>
  </div>
  `
})
export class FollowFollowerComponent {
  @Input() title: string;

  // モーダル
  @ViewChild(Modal) modal;

  constructor (
    private mainService: MainService,
    private userStore: UserStore,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ){}


}
