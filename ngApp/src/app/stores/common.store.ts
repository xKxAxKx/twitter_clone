import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UserService } from '../services/user.service';
import { TweetService } from '../services/tweet.service';

@Injectable()
export class CommonStore {

  errorMessage: string = '';
  successMessage: string = '';

  constructor (
    private userService: UserService,
    private tweetService: TweetService,
  ) {

    // ログインに成功したメッセージを表示する
    // userService.completeUserLoginSubject()が呼ばれたら流れてくる
    this.userService.completeUserLoginSubject.subscribe( () =>{
      this.successMessage = 'Success Login!';
      this.errorMessage = '';
    });

    // ログインに失敗したメッセージを表示する
    this.userService.errorUserLoginSubject.subscribe( () =>{
      this.errorMessage = 'Failed Login...';
      this.successMessage = '';
    });

    // ユーザ作成に成功したメッセージを表示する
    this.userService.completeRegisterSubject.subscribe( () => {
      this.successMessage = 'Success Signup!';
      this.errorMessage = '';
    });

    // ユーザ作成に失敗したメッセージを表示する
    this.userService.errorRegisterSubject.subscribe(
      (err) => {
        this.errorMessage = 'Failed Signup...';
        if(err.username) {
          console.log(err.username);
        }
        if(err.email) {
          console.log(err.email);
        }
        this.successMessage = '';
    });

    // ログアウトしたメッセージを表示する
    this.userService.logoutUserSubject.subscribe( () => {
      this.successMessage = 'Logged out';
    });

    // ログアウトしたメッセージを表示する
    this.userService.errorUserInfoSubjct.subscribe(
      (err) => {
        this.errorMessage = 'There is no account that does not exist';
    });

    // ツイート成功したメッセージを表示する
    this.tweetService.completePostTweetSubject.subscribe(
      (tweet) => {
        this.successMessage = `Tweeted that "${tweet}".`;
        this.errorMessage = '';
    });

    // ツイート失敗したメッセージを表示する
    this.tweetService.errorPostTweetSubject.subscribe( () => {
      this.successMessage = '';
      this.errorMessage = 'Tweet Failed...';
    });

    // ユーザ更新成功したメッセージを表示する
    this.userService.successUpdateUserInfoSubjct.subscribe( () =>{
      this.successMessage = 'Success Update';
      this.errorMessage = '';
    });

    // ユーザ更新失敗したしたメッセージを表示する
    this.userService.errorUpdateUserInfoSubjct.subscribe( () =>{
      this.successMessage = '';
      this.errorMessage = 'Failed Update...';
    });

  }
}
