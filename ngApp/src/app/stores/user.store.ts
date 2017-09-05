import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UserService } from '../services/user.service';

@Injectable()
export class UserStore {

  // ログインユーザのトークン
  loginUserToken: any = {};

  // ログインしているか否か
  // デフォルトではFalse
  userLogin: boolean = false;

  // ログインユーザの情報
  loginUserInfo: any = {};

  constructor (
    private userService: UserService
  ) {

    // ログイン状態を判定する
    // userService.checkLogin()が呼ばれたら流れてくる
    this.userService.completeUserLoginSubject.subscribe( () => {
      this.userLogin = true;
      console.log(this.userLogin);
    });


    // ログインユーザーの情報を格納する
    // userService.fetchLoginUserInfo()が呼ばれたら流れてくる
  }
}
