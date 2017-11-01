import {
          Component,
          ViewChild,
          EventEmitter,
          Output,
          ChangeDetectorRef
        } from '@angular/core';

import { UserStore } from '../stores/user.store';
import { TweetService } from '../services/tweet.service';
import { TweetStore } from '../stores/tweet.store';

@Component({
  selector: 'modal-dialog',
  inputs: [
    'data'
  ],
  template: `
  <div class="mod-Modal_Inner">
    <p [innerHTML]="data.text"><p>
  </div>
  <ul class="mod-Modal_ButtonList" style="list-style:none;">
    <li class="mod-Modal_Button">
      <button class="btn btn-success"
        (click)="okModal()"
        [disabled]="!data.okBtnAble">OK</button>
    </li>
    <li class="mod-Modal_Button">
      <button class="btn btn-error"
        (click)="cancelModal()"
        [disabled]="!data.cancelBtnAble">Cancel</button>
    </li>
  </ul>
  `
})
export class ModalDialog {

  data: any;

  /**
   * OK の Output
   */
  @Output() okEvent: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Cancel の Output
   */
  @Output() cancelEvent: EventEmitter<number> = new EventEmitter<number>();


  /**
   * Cancelを押した
   */
  okModal() {
    this.okEvent.emit();
  }

  /**
   * Cancelを押した
   */
  cancelModal() {
    this.cancelEvent.emit();
  }

  constructor(
  ) {
  }
}


@Component({
  selector: 'modal-tweet',
  inputs: [
    'data'
  ],
  template: `
  <div class="mod-Modal_Inner">
    <div *ngIf="data.tweet.parent.length >= 1">
      <h5>Reply from</h5>
      <div *ngFor="let parent of data.tweet.parent">
        <p><a [routerLink]="['/user', parent.parent.user.id]" (click)="cancelModal()">@{{parent.parent.user.username}}</a> {{parent.parent.tweet}}</p>
      </div>
      <hr>
    </div>
    <h4><a [routerLink]="['/user', data.tweet.user.id]" (click)="cancelModal()">@{{data.tweet.user.username}}</a></h4>
    <h3>{{data.tweet.tweet}}</h3>
    <p>{{data.tweet.created_at | date: 'yyyy/MM/dd hh:mm:ss'}}</p>
    <hr>
    <h5>Reply to this tweet</h5>
    <div class="tweet_post">
      <tweet-post [parent_tweet]="data.tweet" [isFavList]="data.options.isFavList"></tweet-post>
    </div>
    <hr style="margin-top: 50px;">
    <div *ngIf="data.tweet.children.length >= 1">
      <h5>Respond to this tweet</h5>
      <div *ngFor="let child of data.tweet.children">
        <p><a [routerLink]="['/user', child.child.user.id]" (click)="cancelModal()">@{{child.child.user.username}}</a> {{child.child.tweet}}</p>
      </div>
    </div>
  </div>
  `
})
export class ModalTweet {

  constructor(
    private userStore: UserStore,
    private tweetService: TweetService,
  ) {
  }

  data: any;

  @Output() okEvent: EventEmitter<number> = new EventEmitter<number>();

  @Output() cancelEvent: EventEmitter<number> = new EventEmitter<number>();

  okModal() {
    this.okEvent.emit();
  }


  cancelModal() {
    this.cancelEvent.emit();
  }

}


@Component({
  selector: 'modal',
  inputs: [
    'data'
  ],
  template: `
  <ng-container
    *ngIf="data.isShow">
    <div class="mod-Modal">
      <div class="mod-Modal_Bg" (click)="closeModal($event)"></div>
      <div class="mod-Modal_Panel"
        [class.mod-Modal_Panel--dialog]="data.type === 'dialog'"
        [class.mod-Modal_Panel--dialog]="data.type === 'tweet'">
        <div *ngIf="data.type === 'dialog'" class="mod-Modal_Header">
          <div class="mod-Modal_Heading">{{data.title}}</div>
        </div>
        <modal-dialog
          *ngIf="data.type === 'dialog'"
          [data]="data"
          (okEvent)="okModal()"
          (cancelEvent)="closeModal()"></modal-dialog>
          <modal-tweet
            *ngIf="data.type === 'tweet'"
            [data]="data"
            (okEvent)="okModal()"
            (cancelEvent)="closeModal()"></modal-tweet>
      </div>
    </div>
  </ng-container>
  `
})
export class Modal {

  /**
   * モーダルを表示するか否か
   */
  isShow: boolean = false;

  /**
   * モーダルのデータ
   */
  data: any;

  /**
   * OKだったときのコールバックを保存しておくやつ
   */
  okCallback: any = null;

  /**
   * okCallback が成功したときのコールバックを保存しておくやつ
   */
  successCallback: any = null;

  /**
   * okCallback が失敗したときのコールバックを保存しておくやつ
   */
  failCallback: any = null;

  /**
   * キャンセルしたときのコールバックを保存しておくやつ
   */
  cancelCallback: any = null;

  /**
   * モーダルを閉じる の Output
   */
  @Output() cancelEvent: EventEmitter<any> = new EventEmitter<any>();


  /**
   * OKを押したときのコールバック設定
   * 親から呼ばれる
   * @param okCallback - OKを押したときのコールバック
   * @param successCallback - okCallback が成功したときのコールバック
   * @param failCallback - okCallback が失敗したときのコールバック
   */
  openModal(okCallback: (_: any) => any, successCallback: (_: any) => any, failCallback: (_: any) => any, cancelCallback: (_: any) => any) {
    this.okCallback = okCallback;
    this.successCallback = successCallback;
    this.failCallback = failCallback;
    this.cancelCallback = cancelCallback;
  }

  /**
   * モーダルの閉じるボタンを押した
   */
  closeModal() {
    if(this.cancelCallback) {
      this.cancelCallback();
      this.cancelCallback = null;
      this.cancelEvent.emit();

    } else if(this.okCallback) {
      this.cancelEvent.emit();

    } else if(!this.data.fail && this.successCallback) {
      this.successCallback();
      this.successCallback = null;

    } else if(this.failCallback) {
      this.failCallback();
      this.failCallback = null;

    } else {
      this.cancelEvent.emit();
    }
  }

  /**
   * OKだったらコールバックを実行
   */
  okModal() {
    if(this.okCallback) {
      this.okCallback();
      this.okCallback = null;

    } else if(!this.data.fail && this.successCallback) {
      this.successCallback();
      this.successCallback = null;

    } else if(this.failCallback) {
      this.failCallback();
      this.failCallback = null;

    } else {
      this.cancelEvent.emit();
    }
  }


  resetAll() {
    this.cancelCallback = null;
    this.okCallback = null;
    this.successCallback = null;
    this.failCallback = null;
  }

  constructor(
  ) {
  }
}
