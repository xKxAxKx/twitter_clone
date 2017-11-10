import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { UserService } from '../services/user.service';
import { UserStore } from '../stores/user.store';
import { Modal }  from '../utils/modal';
import { IModal } from '../models';

@Component({
  selector: 'myPage',
  template: `
  <div class="center">
    <div class="row">
      <div class="edit_user">
        <h3>Edit User Info</h3>
        <form name="form" (ngSubmit)="updateUserInfo()" #f="ngForm" novalidate>
          <div class="form-group" [ngClass]="{ 'has-error': f.submitted && !email.valid }">
            <label>Email</label>
            <input
              type="text"
              class="form-control login-form"
              placeholder="email"
              name="email"
              [(ngModel)]="editUserInfo.email"
              #email="ngModel"
              required
            />
          </div>
          <div class="form-group" [ngClass]="{ 'has-error': f.submitted && !username.valid }">
            <label>Username</label>
            <input
              type="text"
              class="form-control login-form"
              placeholder="username"
              name="username"
              [(ngModel)]="editUserInfo.username"
              #username="ngModel"
              required
            />
          </div>
          <div class="form-group">
            <label>Profile</label>
            <textarea
              class="form-control login-form"
              placeholder="profile"
              name="profile"
              [(ngModel)]="editUserInfo.profile"
              #profile="ngModel"
            ></textarea>
          </div>
          <button [disabled]=!isAbleChangeUserInfo class="btn btn-success pull-right login-form">
            Edit User Info
          </button>
        </form>
      </div>
      <div style="margin-top:70px;" class="edit_password">
        <h3>Edit Password</h3>
        <form name="form" (ngSubmit)="changePassword()" #f="ngForm" novalidate>
          <div class="form-group" [ngClass]="{ 'has-error': f.submitted && !oldpassword.valid }">
            <label>Current Password</label>
            <input
              type="password"
              class="form-control login-form"
              name="oldpassword"
              [(ngModel)]="oldPassword"
              #oldpassword
              required
              />
          </div>
          <div class="form-group" [ngClass]="{ 'has-error': f.submitted && !newpassword.valid }">
            <label>New Password</label>
            <input
              type="password"
              class="form-control login-form"
              name="newpassword"
              [(ngModel)]="newPassword"
              #newpassword
              required
              />
          </div>
          <div class="form-group" [ngClass]="{ 'has-error': f.submitted && !repeatnewpassword.valid }">
            <label>New Password(repeat)</label>
            <input
              type="password"
              class="form-control login-form"
              name="repeatnewpassword"
              [(ngModel)]="repeatNewPassword"
              #repeatnewpassword
              required
              />
          </div>
          <button type="submit" [disabled]=!isAbleChangePassword class="btn btn-success pull-right login-form">
            Edit Password
          </button>
        </form>
      </div>
      <div style="margin-top:70px; margin-bottom:50px;">
        <h3>Delete User</h3>
        <p>Deleting a user can never be undone</p>
        <button (click)="deleteUser()" class="btn btn-danger">Delete User</button>
      </div>
    </div>
  </div>
  <modal
    [data]="this.userStore.modalData"
    (cancelEvent)="closeModal()"></modal>
  `
})
export class MyPageComponent {

  @ViewChild(Modal) modal;

  editUserInfo:any = {};
  newPassword:string = '';
  oldPassword:string = '';
  repeatNewPassword:string = '';


  get isAbleChangeUserInfo(): boolean {
    return this.editUserInfo.email &&
      this.editUserInfo &&
      this.editUserInfo.email.length > 0 &&
      this.editUserInfo.username.length > 0;
  }

  get isAbleChangePassword(): boolean {
    return this.newPassword.length > 0 &&
    this.oldPassword.length > 0 &&
    this.repeatNewPassword.length > 0;
  }

  get dialogData(): IModal {
    return this.userStore.modalData;
  }

  constructor (
    private userStore: UserStore,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ){
    this.userStore.completeSetLoginUserInfoSubject.subscribe( () => {
      this.setFormData();
    });
  }

  ngOnInit() {
    this.setFormData()
  }

  setFormData() {
    this.editUserInfo.email = this.userStore.loginUserInfo.email;
    this.editUserInfo.username = this.userStore.loginUserInfo.username;
    this.editUserInfo.profile = this.userStore.loginUserInfo.profile;
  }

  updateUserInfo() {
    this.userService.updateUserInfo(this.editUserInfo);
  }

  changePassword() {
    if(this.newPassword == this.repeatNewPassword) {
      this.setFormData();
      this.editUserInfo.old_password = this.oldPassword;
      this.editUserInfo.new_password = this.newPassword;
      this.userService.updatePassword(this.editUserInfo);
    } else {
      this.userService.notMatchNewPassword();
    }
  }

  deleteUser() {
    this.dialogData.type = 'dialog';
    this.dialogData.isShow = true;
    this.dialogData.title = 'Delete Your Account';
    this.dialogData.text = `Delete Your Account.<br>Deleting a user can never be undone.<br><br>Is it OK?`;
    this.dialogData.okBtnAble = true;
    this.dialogData.cancelBtnAble = true;
    this.modal.openModal(
      // ツイート削除に対してOKを押した時
      () => {
        this.closeModal();
        this.userService.deleteUser();
      }
    );
  }

  closeModal() {
    /*
     * モーダルの内容を設定
     */
    this.dialogData.isShow = false;
    this.dialogData.title = '';
    this.dialogData.tweet = {};
    this.dialogData.okBtnAble = false;
    this.dialogData.cancelBtnAble = false;

    this.modal.resetAll();
  }


}
