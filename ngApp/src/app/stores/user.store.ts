import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UserService } from '../services/user.service';
import { IUser, ILoginUser, ISignUpUser, IModal } from '../models';

@Injectable()
export class UserStore {

  // モーダルの情報
  modalData: IModal = {
    isShow: false,
    type: 'dialog',
    title: '',
    text: '',
    fail: false,
    okBtnAble: false,
    cancelBtnAble: false,
  } as IModal;

  // ログインユーザのトークン
  loginUserToken: any = {};

  // ログインしているか否か
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
      }
    );

    this.userService.errorUserInfoSubjct.subscribe(
      (res) => {
        this.fetchUserInfo = {} as IUser;;
      }
    );

    // ユーザフォローsuccess
    this.userService.successUserFollowSubjct.subscribe(
      (res) => {
        this.modalData.text = `Followed User!`;
        this.modalData.okBtnAble = true;
      }
    );

    // ユーザフォローerror
    this.userService.errorUserFollowSubjct.subscribe(
      (err) => {
        this.modalData.text = `Failed Follow User...`;
        this.modalData.fail = true;
        this.modalData.okBtnAble = true;
      }
    );

    // ユーザリムーブsuccess
    this.userService.successUserRemoveSubjct.subscribe(
      (res) => {
        this.modalData.text = `Removed User!`;
        this.modalData.okBtnAble = true;
      }
    );

    // ユーザリムーブerror
    this.userService.errorUserRemoveSubjct.subscribe(
      (err) => {
        this.modalData.text = `Failed Remove User...`;
        this.modalData.fail = true;
        this.modalData.okBtnAble = true;
      }
    );

  }
}
