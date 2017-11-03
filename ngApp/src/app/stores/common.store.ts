import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { TweetService } from '../services/tweet.service';

@Injectable()
export class CommonStore {

  errorMessage: string = '';
  successMessage: string = '';

  constructor (
    private userService: UserService,
    private tweetService: TweetService,
    private router: Router,
  ) {

    router.events.subscribe(() => {
      this.errorMessage = '';
      this.successMessage = '';
    });

    // ログインに成功したメッセージを表示する
    // userService.completeUserLoginSubject()が呼ばれたら流れてくる
    this.userService.completeUserLoginSubject.subscribe( () =>{
      this.successMessage = 'Success Login!';
      this.errorMessage = '';
    });

    // ログインに失敗したメッセージを表示する
    this.userService.errorUserLoginSubject.subscribe( () =>{
      this.errorMessage = 'Failed Login...';
      this.errorMessage = '';
    });

    // ユーザ作成に成功したメッセージを表示する
    this.userService.completeRegisterSubject.subscribe( () => {
      this.successMessage = 'Success Signup!';
    });

    // ユーザ作成に失敗したメッセージを表示する
    this.userService.errorRegisterSubject.subscribe(
      (err) => {
        this.errorMessage = 'Failed Signup...';
    });

    // ログアウトしたメッセージを表示する
    this.userService.logoutUserSubject.subscribe( () => {
      this.successMessage = 'Logged out';
    });

    // 存在しないユーザIDにアクセスした場合のメッセージを表示する
    this.userService.errorUserInfoSubjct.subscribe(
      (err) => {
        this.errorMessage = 'There is no account that does not exist';
    });

    // ツイート成功したメッセージを表示する
    this.tweetService.completePostTweetSubject.subscribe(
      (tweet) => {
        this.successMessage = `Tweeted that "${tweet}".`;
    });

    // ツイート失敗したメッセージを表示する
    this.tweetService.errorPostTweetSubject.subscribe( () => {
      this.errorMessage = 'Tweet Failed...';
    });

    // ユーザ更新成功したメッセージを表示する
    this.userService.successUpdateUserInfoSubjct.subscribe( () =>{
      this.successMessage = 'Success Update';
    });

    // ユーザ更新失敗したメッセージを表示する
    this.userService.errorUpdateUserInfoSubjct.subscribe( () =>{
      this.errorMessage = 'Failed Update...';
    });

    // 新しいパスワードが一致しないメッセージを表示する
    this.userService.notMatchNewPasswordSubject.subscribe( () => {
      this.errorMessage = 'New passwords do not match';
    });

  }
}
