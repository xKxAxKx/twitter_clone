import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';

import { CommonStore } from '../stores/common.store';
import { UserStore } from '../stores/user.store';
import { UserService } from '../services/user.service';

@Component({
  selector: 'header',
  template: `
    <nav class="navbar navbar-default">
      <div class="container">
        <a routerLink="/" class="title navbar-brand">Twitter Clone</a>
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a [routerLink]="['user', userStore.loginUserInfo.id]" class="cursor_pointer">
              @{{ userStore.loginUserInfo.username }}
            </a>
          </li>
          <li>
            <a (click)="logout()" class="cursor_pointer">Logout</a>
          </li>
          <li>
            <a routerLink="/login" class="cursor_pointer">Login</a>
          </li>
          <li>
            <a routerLink="/signup"  class="cursor_pointer">Signup</a>
          </li>
        </ul>
      </div>
    </nav>
  `
})
export class HeaderComponent {
  constructor (
    private userStore: UserStore,
    private userService: UserService,
  ){}

  logout() {
    this.userService.logout();
  }

}
