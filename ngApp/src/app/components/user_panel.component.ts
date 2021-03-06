import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserStore } from '../stores/user.store';
import { UserService } from '../services/user.service';
import { Modal }  from '../utils/modal';

import { IModal } from '../models';

@Component({
  selector: 'user-panel',
  template: `
    <div class="panel panel-primary">
      <div class="panel-heading">
        <a class="string-in-panel-heading" routerLink="/user/{{userStore.fetchUserInfo.id}}">
          @{{ userStore.fetchUserInfo.username }}
        </a>
      </div>
      <div class="panel-body">
        <p class="user-profile-in-panel">{{ userStore.fetchUserInfo.profile }}</p>
        <div class="ProfileCardStats">
          <a *ngIf="userStore.fetchUserInfo.follows" routerLink="/user/{{userStore.fetchUserInfo.id}}/follows">
            {{ userStore.fetchUserInfo.follows.length }} Follow
          </a>
          <a *ngIf="userStore.fetchUserInfo.followers" routerLink="/user/{{userStore.fetchUserInfo.id}}/follwers">
            {{ userStore.fetchUserInfo.followers.length }} Follower
          </a>
          <a routerLink="/user/{{userStore.fetchUserInfo.id}}/fav_list">
            Favorites
          </a>
        </div>
        <div *ngIf="userStore.fetchUserInfo.id === userStore.loginUserInfo.id">
          <button routerLink='/mypage' class="btn btn-primary">Edit Profile</button>
        </div>
        <div *ngIf="userStore.fetchUserInfo.id !== userStore.loginUserInfo.id">
          <button *ngIf="userStore.fetchUserInfo.is_follow === false" (click)="userFollow()" class="btn btn-primary">Follow</button>
          <button *ngIf="userStore.fetchUserInfo.is_follow === true" (click)="userRemove()" class="btn btn-danger">Unfollow</button>
        </div>
      </div>
    </div>
    <modal
      [data]="this.userStore.modalData"
      (cancelEvent)="closeModal()"></modal>
  `
})
export class UserPanelComponent {

  is_follow: boolean;

  // モーダル
  @ViewChild(Modal) modal;

  constructor (
    private userStore: UserStore,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ){}

  get dialogData(): IModal {
    return this.userStore.modalData;
  }

  userFollow() {
    this.dialogData.isShow = true;
    this.dialogData.title = 'Follow User';
    this.dialogData.text = `Follow @${this.userStore.fetchUserInfo.username}.<br>Is it OK?`;
    this.dialogData.okBtnAble = true;
    this.dialogData.cancelBtnAble = true;

    this.modal.openModal(
      // ユーザフォローに対してOKを押した時
      () => {
        this.dialogData.text = "Following User..."
        this.dialogData.okBtnAble = false;
        this.dialogData.cancelBtnAble = false;
        this.userService.userFollow(this.userStore.fetchUserInfo);
      },
      // ユーザーフォローしましたに対してOKを押した時
      () => {
        this.closeModal();
      }
    );
  }

  userRemove() {
    this.dialogData.isShow = true;
    this.dialogData.title = 'Remove User';
    this.dialogData.text = `Remove @${this.userStore.fetchUserInfo.username}.<br>Is it OK?`;
    this.dialogData.okBtnAble = true;
    this.dialogData.cancelBtnAble = true;
    this.modal.openModal(
      // ユーザフォローに対してOKを押した時
      () => {
        this.dialogData.text = "Removing User..."
        this.dialogData.okBtnAble = false;
        this.dialogData.cancelBtnAble = false;
        this.userService.userRemove(this.userStore.fetchUserInfo);
      },
      // ユーザーフォローしましたに対してOKを押した時
      () => {
        this.closeModal();
      }
    );
  }

  closeModal() {
    /*
     * モーダルの内容を設定
     */
    this.dialogData.isShow = false;
    this.dialogData.title = '';
    this.dialogData.text = '';
    this.dialogData.okBtnAble = false;
    this.dialogData.cancelBtnAble = false;

    this.modal.resetAll();
  }

}
