import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { UserService } from '../services/user.service';
import { TweetService } from '../services/tweet.service';

@Injectable()
export class CommonStore {

  errorMessage: string = '';
  successMessage: string = '';
  counter: number = 0;

  constructor (
    private userService: UserService,
    private tweetService: TweetService,
    private router: Router,
  ) {

    router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(() => {
        this.counter -= 1;
        if(this.counter <= 0) {
          this.errorMessage = '';
          this.successMessage = '';
        }
    });

    // ログインに成功したメッセージを表示する
    // userService.successUserLoginSubject()が呼ばれたら流れてくる
    this.userService.successUserLoginSubject.subscribe( () =>{
      this.successMessage = 'Success Login!';
      this.errorMessage = '';
      this.counter = 2;
    });

    // ログインに失敗したメッセージを表示する
    this.userService.errorUserLoginSubject.subscribe( () =>{
      this.errorMessage = 'Failed Login...';
      this.successMessage = '';
      this.counter = 1;
    });

    // ユーザ作成に成功したメッセージを表示する
    this.userService.completeRegisterSubject.subscribe( () => {
      this.successMessage = 'Success Signup!';
      this.errorMessage = '';
      this.counter = 2;
    });

    // ユーザ作成に失敗したメッセージを表示する
    this.userService.errorRegisterSubject.subscribe(
      (err) => {
        this.errorMessage = 'Failed Signup...';
        this.successMessage = '';
        this.counter = 1;
    });

    // ログアウトしたメッセージを表示する
    this.userService.logoutUserSubject.subscribe( () => {
      this.successMessage = 'Logged out';
      this.errorMessage = '';
      this.counter = 2;
    });

    // 存在しないユーザIDにアクセスした場合のメッセージを表示する
    this.userService.errorUserInfoSubjct.subscribe(
      (err) => {
        this.errorMessage = 'There is no account that does not exist';
        this.successMessage = '';
        this.counter = 1;
    });

    // ツイート成功したメッセージを表示する
    this.tweetService.completePostTweetSubject.subscribe(
      (tweet) => {
        this.successMessage = `Tweeted that "${tweet}".`;
        this.errorMessage = '';
        this.counter = 1;
    });

    // ツイート失敗したメッセージを表示する
    this.tweetService.errorPostTweetSubject.subscribe( () => {
      this.errorMessage = 'Tweet Failed...';
      this.successMessage = '';
      this.counter = 1;
    });

    // ユーザ更新成功したメッセージを表示する
    this.userService.successUpdateUserInfoSubjct.subscribe( () =>{
      this.successMessage = 'Success Update UserInfo';
      this.errorMessage = '';
      this.counter = 1;
    });

    // ユーザ更新失敗したメッセージを表示する
    this.userService.errorUpdateUserInfoSubjct.subscribe( () =>{
      this.errorMessage = 'Failed Update UserInfo...';
      this.successMessage = '';
      this.counter = 1;
    });

    // 新しいパスワードが一致しないメッセージを表示する
    this.userService.notMatchNewPasswordSubject.subscribe( () => {
      this.errorMessage = 'New passwords do not match';
      this.successMessage = '';
      this.counter = 1;
    });

  }
}
