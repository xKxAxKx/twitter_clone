import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

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
      </div>
    </div>
  </div>
  `
})
export class MyPageComponent {

  editUserInfo:any = {};

  get isAbleChangeUserInfo(): boolean {
    return this.editUserInfo.email &&
      this.editUserInfo &&
      this.editUserInfo.email.length > 0 &&
      this.editUserInfo.username.length > 0;
  }

  constructor (
    private userStore: UserStore,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ){}

  ngOnInit() {
    setTimeout(() => {
      this.setFormData();
    }, 500);
  }

  setFormData() {
    this.editUserInfo.email = this.userStore.loginUserInfo.email;
    this.editUserInfo.username = this.userStore.loginUserInfo.username;
    this.editUserInfo.profile = this.userStore.loginUserInfo.profile;
  }

  updateUserInfo() {
    
  }


}
