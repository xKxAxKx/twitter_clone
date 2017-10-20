import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';
import { UserStore } from '../stores/user.store';
import { UserService } from '../services/user.service';

@Component({
  selector: 'user-panel',
  template: `
    <div class="panel panel-primary">
      <div class="panel-heading">
        @{{ userStore.fetchUserInfo.username }}
      </div>
      <div class="panel-body">
        <p class="user-profile-in-panel">{{ userStore.fetchUserInfo.profile }}</p>
        <p *ngIf="userStore.fetchUserInfo.id === userStore.loginUserInfo.id">
          <a [routerLink]="['/mypage']">Change Profile</a>
        </p>
        <div *ngIf="userStore.fetchUserInfo.id !== userStore.loginUserInfo.id">
          <button (click)="userFollow()" class="btn btn-primary">フォローする</button>
          <button (click)="userRemove()" class="btn btn-danger">フォロー解除する</button>
        </div>
      </div>
    </div>
  `
})
export class UserPanelComponent {

  get_user_id: number = null;

  constructor (
    private mainService: MainService,
    private userStore: UserStore,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ){}

  userFollow() {
    console.log("動いた");
  };

  userRemove() {
    console.log("動いた");
  };

}
