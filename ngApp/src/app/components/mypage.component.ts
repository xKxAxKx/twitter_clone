import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { UserStore } from '../stores/user.store';

@Component({
  selector: 'myPage',
  template: `
  <div class="center">
    <div class="row">
      ユーザ編集画面
  </div>
  `
})
export class MyPageComponent {

  user_id = '';

  constructor (
    private userStore: UserStore,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ){}

  ngOnInit() {

  }
}
