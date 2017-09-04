import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';

@Component({
  selector: 'main-component',
  template: `
  <div class="container">
    <div class="center">
      <div class="row">
        <div class="col-sm-8">
          ここはメインページ。<br>
          コンポーネントは以下に分ける<br>
          1)自分のプロフィール表示<br>
          2)タイムラインの表示<br>
          3)つぶやくフィールド<br>
        </div>
      <div>
    </div>
  </div>
  `
})
export class MainComponent {

}
