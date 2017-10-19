import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UserService } from '../services/user.service';
import { IUser, ILoginUser, ISignUpUser } from '../models';

@Injectable()
export class UserStore {

  // ログインユーザのトークン
  loginUserToken: any = {};

  // ログインしているか否か
  // デフォルトではFalse
  userLogin: boolean;

  // ログインユーザの情報
  loginUserInfo: IUser = {} as IUser;

  // ログインユーザの情報の取得が完了した時のSubject
  loginUserInfoSubject: Subject<void> = new Subject<void>();

  // 指定したidのユーザの情報
  fetchUserInfo: IUser = {} as IUser;

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
        console.log("ログインユーザーの情報を格納する");
        this.loginUserInfo = res.json();
        this.loginUserInfoSubject.next();
      }
    );

    // ログアウト状態にする
    // userService.logoutUserSubjectが呼ばれたら流れてくる
    this.userService.logoutUserSubject.subscribe( () => {
      this.userLogin = false;
      this.loginUserToken = {};
      this.loginUserInfo = {} as IUser;
    });

    // 指定したidのユーザーの情報を格納する
    this.userService.successUserInfoSubjct.subscribe(
      (res) => {
        this.fetchUserInfo = res.json();
        console.log("指定したidのユーザーの情報を格納する");
      }
    );

    this.userService.errorUserInfoSubjct.subscribe(
      (res) => {
        this.fetchUserInfo = {} as IUser;;
      }
    );

  }
}
