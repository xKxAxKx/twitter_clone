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

  // ログインユーザの情報の取得が完了した時のSubject
  loginUserInfoSubject: Subject<void> = new Subject<void>();

  // 指定したidのユーザの情報
  fetchUserInfo: any = {};

  constructor (
    private userService: UserService
  ) {

    // ログイン状態を判定する
    // userService.checkLogin()が呼ばれたら流れてくる
    this.userService.completeUserLoginSubject.subscribe( () => {
      this.userLogin = true;
    });


    // ログインユーザーの情報を格納する
    // userService.fetchLoginUserInfo()が呼ばれたら流れてくる
    this.userService.fetchLoginUserInfoSubjct.subscribe(
      (res) => {
        this.loginUserInfo = res.json();
        this.loginUserInfoSubject.next();
      }
    );

    // ログアウト状態にする
    // userService.logoutUserSubjectが呼ばれたら流れてくる
    this.userService.logoutUserSubject.subscribe( () => {
      this.userLogin = false;
      this.loginUserToken = {};
      this.loginUserInfo = {};
    });

    // 指定したidのユーザーの情報を格納する
    this.userService.successUserInfoSubjct.subscribe(
      (res) => {
        this.fetchUserInfo = res.json();
      }
    );

    this.userService.errorUserInfoSubjct.subscribe(
      (res) => {
        this.fetchUserInfo = {};
      }
    );

  }
}
