import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { UserStore } from '../stores/user.store';

import { ISignUpUser } from '../models';

@Component({
  selector: 'signup',
  template: `
  <div class="center">
    <div class="row">
      <h3>Sign Up</h3>
      <form name="form" (ngSubmit)="signup()" #f="ngForm" novalidate>
        <div class="form-group" [ngClass]="{ 'has-error': f.submitted && !email.valid }">
          <label>Email</label>
          <input
            type="text"
            class="form-control login-form"
            placeholder="email"
            name="email"
            [(ngModel)]="SignupUserInput.email"
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
            [(ngModel)]="SignupUserInput.username"
            #username="ngModel"
            required
          />
        </div>
        <div class="form-group" [ngClass]="{ 'has-error': f.submitted && !password.valid }">
          <label>Password</label>
          <input
            type="password"
            class="form-control login-form"
            placeholder="password"
            name="password"
            [(ngModel)]="SignupUserInput.password"
            #password="ngModel"
            required
          />
        </div>
        <div class="form-group">
          <label>Profile</label>
          <textarea
            class="form-control login-form"
            placeholder="profile"
            name="profile"
            [(ngModel)]="SignupUserInput.profile"
            #profile="ngModel"
          ></textarea>
        </div>
        <button class="btn btn-success pull-right login-form">
          SignUP
        </button>
      </form>
    </div>
  </div>
  `
})
export class SignupComponent {
  SignupUserInput = {} as ISignUpUser;

  constructor(
    private userService: UserService,
    private userStore: UserStore,
    private route: ActivatedRoute,
    private router: Router,
  ){}

  ngOnInit() {
    if(this.userStore.userLogin) {
      this.router.navigate(['/']);
    };
  }

  signup() {
    this.userService.siginUp(this.SignupUserInput)
  }

}
