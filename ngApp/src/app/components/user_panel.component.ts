import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';
import { UserStore } from '../stores/user.store';
import { UserService } from '../services/user.service';
import { Modal }  from '../utils/modal';

import { IModal } from '../models';

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
    <modal
      [data]="this.userStore.modalData"
      (cancelEvent)="closeModal()"></modal>
  `
})
export class UserPanelComponent {

  // モーダル
  @ViewChild(Modal) modal;

  constructor (
    private mainService: MainService,
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
  };

  userRemove() {
    this.userService.userFollow(this.userStore.fetchUserInfo);
  };

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
