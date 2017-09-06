import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs';

import { CommonService } from './common.service';

@Injectable()
export class UserService {
  loginTokenName = 'twitter_clone_token';
  LoginToken: any = {};
  private LoginApi = `http://127.0.0.1:8000/api/user/login/`;
  private FetchLoginUserApi = `http://127.0.0.1:8000/api/user/mypage/`;
  private RegisterApi = `http://127.0.0.1:8000/api/user/register/`;

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

  constructor(
    private http: Http,
    private router: Router,
    private commonService: CommonService,
  ){}


  // パスワードとemailでログインする
  passwordLogin(email:string, password:string) {
    return this.http
      .post(this.LoginApi, {email: email, password: password})
      .subscribe(
        (res) => {
          let token = JSON.stringify(res.json());
          this.saveToken(token);
          this.completeUserLoginSubject.next();
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

  // ユーザ登録画面から登録する
  siginUp(registerInfo) {
    return this.http
      .post(this.RegisterApi, registerInfo)
      .subscribe(
        (res) => {
          this.completeRegisterSubject.next();
        },
        (err) => {
          this.errorRegisterSubject.next();
        }
      );;
  }

}
