import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';

@Component({
  selector: 'header',
  template: `
    <nav class="navbar navbar-default">
      <div class="container">
        <a routerLink="/" class="title navbar-brand">Twitter Clone</a>
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a routerLink="/mypage" class="cursor_pointer">@UserName</a>
          </li>
          <li>
            <a routerLink="/logout" class="cursor_pointer">LogOut</a>
          </li>
          <li>
            <a routerLink="/login" class="cursor_pointer">Login</a>
          </li>
          <li>
            <a routerLink="/signup"  class="cursor_pointer">Signup</a>
          </li>
        </ul>
      </div>
    </nav>
  `
})
export class HeaderComponent {
  
}
