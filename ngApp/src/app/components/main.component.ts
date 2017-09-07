import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';

@Component({
  selector: 'main',
  template: `
  <div class="center">
    <div class="row">
      <div class="col-sm-4">
        <div class="panel panel-primary">
          <div class="panel-heading">@ログインユーザ名</div>
          <div class="panel-body">プロフィールが入る</div>
        </div>
      </div>
      <div class="col-sm-8">
        <tweet-post></tweet-post>
      </div>
    <div>
  </div>
  `
})
export class MainComponent {

}
