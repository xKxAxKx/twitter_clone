import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { UserStore } from '../stores/user.store';

@Component({
  selector: 'login',
  template: `
  <div class="center">
    <div class="row">
      <h3>Login</h3>
      <form name="form" (ngSubmit)="passwordLogin()" #f="ngForm" novalidate>
        <div class="form-group" [ngClass]="{ 'has-error': f.submitted && !email.valid }">
          <input
            type="text"
            class="form-control login-form"
            placeholder="email"
            name="email"
            [(ngModel)]="loginUserInput.email"
            #email="ngModel"
            required
          />
        </div>
        <div class="form-group" [ngClass]="{ 'has-error': f.submitted && !password.valid }">
          <input
            type="password"
            class="form-control login-form"
            placeholder="password"
            name="password"
            [(ngModel)]="loginUserInput.password"
            #password="ngModel"
            required
          />
        </div>
        <button class="btn btn-success pull-right login-form">
          Login
        </button>
      </form>
    </div>
  </div>
  `
})
export class LoginComponent {
  loginUserInput: any = {};

  constructor(
    private userService: UserService,
    private userStore: UserStore,
    private route: ActivatedRoute,
    private router: Router,
  ){}

  ngOnInit() {

  }

  passwordLogin() {
    this.userService.passwordLogin(this.loginUserInput.email, this.loginUserInput.password);
  }
}
