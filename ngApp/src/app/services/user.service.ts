import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs';

import { CommonService } from './common.service';
import { TweetService } from './tweet.service';

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
  private UserFollowApi = `http://127.0.0.1:8000/api/user/follow/`;
  private UserRemoveApi = `http://127.0.0.1:8000/api/user/remove/`;
  private FetchFavoriteTweetByUserIdApi = `http://127.0.0.1:8000/api/favorite/get/`;

  // ログインユーザを取得するときのSubject
  fetchLoginUserInfoSubjct: Subject<any> = new Subject<any>();

  // ログインが確認できたときのSubject
  completeUserLoginSubject: Subject<any> = new Subject<any>();

  // ログインが失敗したときのSubject
  errorUserLoginSubject: Subject<any> = new Subject<any>();

  // ユーザー登録が成功したときのSubject
  completeRegisterSubject: Subject<any> = new Subject<any>();

  // ユーザー登録が失敗したときのSubject
  errorRegisterSubject: Subject<any> = new Subject<any>();

  // ログアウトするときのSubject
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

  // ユーザリムーブが成功した時のSubject
  successUserRemoveSubjct: Subject<any> = new Subject<any>();

  // ユーザリムーブが失敗した時のSubject
  errorUserRemoveSubjct: Subject<any> = new Subject<any>();

  // ログインユーザのお気に入りツイート取得が成功した時のSubject
  successFetchLoginUserFavTweetSubject: Subject<any> = new Subject<any>();

  // ログインユーザ以外のユーザのお気に入りツイート取得が成功した時のSubject
  successFetchOtherUserFavTweetSubject: Subject<any> = new Subject<any>();

  constructor(
    private http: Http,
    private router: Router,
    private commonService: CommonService,
    // private tweetService: TweetService,
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
      .map(res => res.json())
      .subscribe(
        (res) => {
          this.fetchLoginUserInfoSubjct.next(res);
          this.FetchFavoriteTweet(res, true);
        },
        (err) => {
          console.log("ユーザ情報の取得に失敗");
        }
      );
  }


  // idで指定したユーザの情報を取得する
  fetchUserInfo(user_id) {
    return this.http
      .get(this.FetchUserApi + user_id, this.commonService.jwt())
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
      .post(this.UserFollowApi, followUser, this.commonService.jwt())
      .subscribe(
        (res) => {
          this.successUserFollowSubjct.next(res);
          this.fetchLoginUserInfo();
          this.fetchUserInfo(followUser.id);
        },
        (err) => {
          this.errorUserFollowSubjct.next();
        }
      );
  }


  // フォローを解除する
  userRemove(removeUser) {
    return this.http
      .delete(this.UserRemoveApi + removeUser.id, this.commonService.jwt())
      .subscribe(
        (res) => {
          this.successUserRemoveSubjct.next(res);
          this.fetchLoginUserInfo();
          this.fetchUserInfo(removeUser.id);
        },
        (err) => {
          this.errorUserRemoveSubjct.next();
        }
      );
  }

  // 指定したユーザIDのお気に入りツイートを取得
  // ログインユーザのものか、そのほかのユーザかを判別
  FetchFavoriteTweet(user, is_LoginUser:boolean) {
    return this.http
      .get(this.FetchFavoriteTweetByUserIdApi + user.id)
      .map(res => res.json())
      .subscribe(
        (res) => {
          if(is_LoginUser) {
            this.successFetchLoginUserFavTweetSubject.next(res);
          } else {
            this.successFetchOtherUserFavTweetSubject.next(res);
          }
        },
        (err) => {
          console.log("お気に入りの取得に失敗");
        }
      )
  }

}
