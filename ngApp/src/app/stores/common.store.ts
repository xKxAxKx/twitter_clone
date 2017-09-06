import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UserService } from '../services/user.service';

@Injectable()
export class CommonStore {

  errorMessage: string = '';
  successMessage: string = '';

  constructor (
    private userService: UserService
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

  }
}
