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
      this.successMessage = 'ログインしました';
      this.errorMessage = '';
    });

    // ログインに失敗したメッセージを表示する
    this.userService.errorUserLoginSubject.subscribe( () =>{
      this.errorMessage = 'メールアドレスかパスワードが間違っています';
      this.successMessage = '';
    });

  }
}
