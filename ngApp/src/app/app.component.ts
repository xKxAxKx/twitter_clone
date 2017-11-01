import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CommonStore } from './stores/common.store';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  template: `
    <header header></header>
    <div class="container">
      <div class="center">
        <div class="row">
        <div class="alert alert-danger" *ngIf="commonStore.errorMessage">
          {{ commonStore.errorMessage }}
        </div>
        <div class="alert alert-success" *ngIf="commonStore.successMessage">
          {{ commonStore.successMessage }}
        </div>
        </div>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  constructor (
    private commonStore: CommonStore,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ){
    
  }

  ngOnInit() {
    this.userService.checkLogin();
  }

}
