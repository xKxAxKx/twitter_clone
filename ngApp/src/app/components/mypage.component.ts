import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { UserService } from '../services/user.service';
import { UserStore } from '../stores/user.store';

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
    </div>
  </div>
  `
})
export class MyPageComponent {

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
      this.editUserInfo.password = this.newPassword;
      this.userService.updatePassword(this.editUserInfo);
    } else {
      this.userService.notMatchNewPassword();
    }
  }


}
