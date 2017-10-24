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
  <div *ngIf="is_follower===true">
    <div *ngIf="userStore.fetchUserInfo.follower_list.length === 0">
      まだ誰にもフォローされていない
    </div>
    <div *ngIf="userStore.fetchUserInfo.follower_list.length > 0">
      <div *ngFor="let followerUser of userStore.fetchUserInfo.follower_list" class="col-sm-4">
        <div class="panel panel-info">
          <div class="panel-heading">
            <a routerLink="/user/{{followerUser.follower.id}}">
              @{{followerUser.follower.username}}
            </a>
          </div>
          <div class="panel-body">
            <p class="user-profile-in-panel">{{followerUser.follower.profile}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div *ngIf="is_follower===false">
    <div *ngIf="userStore.fetchUserInfo.follow_list.length === 0">
      まだ誰もフォローしていない
    </div>
    <div *ngIf="userStore.fetchUserInfo.follow_list.length > 0">
      <div *ngFor="let followUser of userStore.fetchUserInfo.follow_list" class="col-sm-4">
        <div class="panel panel-info">
          <div class="panel-heading">
            <a routerLink="/user/{{followUser.following.id}}">
              @{{followUser.following.username}}
            </a>
          </div>
          <div class="panel-body">
            <p class="user-profile-in-panel">{{followUser.following.profile}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class FollowFollowerComponent {
  @Input() title: string;

  is_follower: boolean;

  constructor (
    private mainService: MainService,
    private userStore: UserStore,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ){}

  ngOnInit() {
    if(this.title.includes('Follower')) {
      this.is_follower = true;
    } else {
      this.is_follower = false;
    }
  }


}
