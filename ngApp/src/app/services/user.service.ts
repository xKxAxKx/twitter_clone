import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs';

import { CommonService } from './common.service';

import { ILoginUser, ISignUpUser } from '../models';

@Injectable()
export class UserService {
  loginTokenName = 'twitter_clone_token';
  LoginToken: any = {};
  private LoginApi = `http://127.0.0.1:8000/api/user/login/`;
  private FetchLoginUserApi = `http://127.0.0.1:8000/api/user/mypage/`;
  private RegisterApi = `http://127.0.0.1:8000/api/user/register/`;
  private FetchUserApi = `http://127.0.0.1:8000/api/user/`;
  private UpdateUserInfoApi = `http://127.0.0.1:8000/api/user/auth_update/`;
  private userFollowApi = `http://127.0.0.1:8000/api/user/follow/`;

  // ログインユーザを取得するときのSubject
  fetchLoginUserInfoSubjct: Subject<any> = new Subject<any>();

  // ログインが確認できたときのSubject
  // UserStoreとCommonStoreに送る
  completeUserLoginSubject: Subject<any> = new Subject<any>();

  // ログインが失敗したときのSubject
  // CommonStoreに送る
  errorUserLoginSubject: Subject<any> = new Subject<any>();

  // ユーザー登録が成功したときのSubject
  // CommonStoreに送る
  completeRegisterSubject: Subject<any> = new Subject<any>();

  // ユーザー登録が失敗したときのSubject
  // UserStoreとCommonStoreに送る
  errorRegisterSubject: Subject<any> = new Subject<any>();

  // ログアウトするときのSubject
  // UserStoreとCommonStoreに送る
  logoutUserSubject: Subject<any> = new Subject<any>();

  // ユーザ情報を取得が成功したときのSubject
  successUserInfoSubjct: Subject<any> = new Subject<any>();

  // ユーザ情報取得が失敗したときのSubject
  errorUserInfoSubjct: Subject<any> = new Subject<any>();

  // ユーザ情報更新が成功した時のSubject
  successUpdateUserInfoSubjct: Subject<any> = new Subject<any>();

  // ユーザ情報更新が失敗した時のSubject
  errorUpdateUserInfoSubjct: Subject<any> = new Subject<any>();

  // パスワードの繰り返し入力が異なる時のSubject
  notMatchNewPasswordSubject: Subject<any> = new Subject<any>();

  // ユーザフォローが成功した時のSubject
  successUserFollowSubjct: Subject<any> = new Subject<any>();

  // ユーザフォローが失敗した時のSubject
  errorUserFollowSubjct: Subject<any> = new Subject<any>();

  constructor(
    private http: Http,
    private router: Router,
    private commonService: CommonService,
  ){}


  // パスワードとemailでログインする
  passwordLogin(loginuser: ILoginUser) {
    return this.http
      .post(this.LoginApi, loginuser)
      .subscribe(
        (res) => {
          let token = JSON.stringify(res.json());
          this.saveToken(token);
          this.completeUserLoginSubject.next();
          this.router.navigate(['/']);
        },
        (err) => {
          this.errorUserLoginSubject.next();
        }
      );
  }


  // トークンをローカルストレージに保存する
  saveToken(token) {
    localStorage.setItem(this.commonService.loginTokenName, token)
    this.checkLogin();
  }


  // ローカルストレージにtokenがあるかを確認
  // OKであれば、ユーザ情報の取得、トークンの値をstoreに格納、ログインフラグをTrueにする
  checkLogin(){
    if (localStorage.getItem(this.commonService.loginTokenName)) {
      this.completeUserLoginSubject.next();
      this.fetchLoginUserInfo();
    } else {
      console.log("ユーザ未ログイン");
    }
  }


  // ログインしているユーザの情報を取得する
  fetchLoginUserInfo() {
    return this.http
      .get(this.FetchLoginUserApi, this.commonService.jwt())
      .subscribe(
        (res) => {
          this.fetchLoginUserInfoSubjct.next(res);
        },
        (err) => {
          console.log("ユーザ情報の取得に失敗");
        }
      );
  }


  // idで指定したユーザの情報を取得する
  fetchUserInfo(user_id) {
    return this.http
      .get(this.FetchUserApi + user_id)
      .subscribe(
        (res) => {
          this.successUserInfoSubjct.next(res);
        },
        (err) => {
          this.errorUserInfoSubjct.next(JSON.parse(err._body));
        }
      );
  }


  // ユーザ登録画面から登録する
  siginUp(SignupUserInput: ISignUpUser) {
    return this.http
      .post(this.RegisterApi, SignupUserInput)
      .subscribe(
        (res) => {
          this.completeRegisterSubject.next();
          this.router.navigate(['/login']);
        },
        (err) => {
          this.errorRegisterSubject.next(JSON.parse(err._body));
        }
      );
  }


  // ログアウトする
  logout() {
    localStorage.removeItem(this.loginTokenName);
    this.logoutUserSubject.next();
    this.router.navigate(['/login']);
  }

  // ログインユーザの情報を更新する
  updateUserInfo(userUpdateInfo) {
    return this.http
      .put(this.UpdateUserInfoApi, userUpdateInfo, this.commonService.jwt())
      .subscribe(
        (res) => {
          this.successUpdateUserInfoSubjct.next(res);
          this.fetchLoginUserInfo()
        },
        (err) => {
          this.errorUpdateUserInfoSubjct.next();
        }
      );
  }

  notMatchNewPassword() {
    this.notMatchNewPasswordSubject.next();
  }

  // ユーザをフォローする
  userFollow(followUser) {
    return this.http
      .post(this.userFollowApi, followUser, this.commonService.jwt())
      .subscribe(
        (res) => {
          this.successUserFollowSubjct.next(res);
        },
        (err) => {
          this.errorUserFollowSubjct.next();
        }
      );
  }

  // フォローを解除する
  userRemove(removeUser){
    console.log("動いた");
  };

}
