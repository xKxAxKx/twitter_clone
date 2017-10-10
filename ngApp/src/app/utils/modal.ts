import {
          Component,
          ViewChild,
          EventEmitter,
          Output,
          ChangeDetectorRef
        } from '@angular/core';


@Component({
  selector: 'modal-alert',
  inputs: [
    'data'
  ],
  template: `
    alert
  `
})
export class ModalAlert {

  data: any;

  /**
   * Cancel の Output
   */
  @Output() cancelEvent: EventEmitter<number> = new EventEmitter<number>();


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
  selector: 'modal-dialog',
  inputs: [
    'data'
  ],
  template: `
  <div class="mod-Modal_Inner">
    <p [innerHTML]="data.text"><p>
  </div>
  <ul class="mod-Modal_ButtonList">
    <li class="mod-Modal_Button">
      <button class="mod-Button-Update"
        (click)="okModal()"
        [disabled]="!data.okBtnAble">OK</button>
    </li>
    <li class="mod-Modal_Button">
      <button class="mod-Button-Delete"
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
  selector: 'modal-error',
  inputs: [
    'data'
  ],
  template: `
    error
  `
})
export class ModalError {

  data: any;

  /**
   * Cancel の Output
   */
  @Output() cancelEvent: EventEmitter<number> = new EventEmitter<number>();


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
  selector: 'modal-media',
  inputs: [
    'data'
  ],
  template: `
    media
  `
})
export class ModalMedia {

  data: any;

  constructor(
  ) {
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
        [class.mod-Modal_Panel--alert]="data.type === 'alert'"
        [class.mod-Modal_Panel--dialog]="data.type === 'dialog'"
        [class.mod-Modal_Panel--error]="data.type === 'error'"
        [class.mod-Modal_Panel--media]="data.type === 'media'">
        <div class="mod-Modal_Header">
          <div class="mod-Modal_Heading">{{data.title}}</div>
          <button class="mod-Modal_Close"
            *ngIf="data.okBtnAble || data.cancelBtnAble"
            (click)="closeModal($event)">cansel</button>
        </div>
        <modal-alert
          *ngIf="data.type === 'alert'"
          [data]="data"
          (cancelEvent)="closeModal()"></modal-alert>
        <modal-dialog
          *ngIf="data.type === 'dialog'"
          [data]="data"
          (okEvent)="okModal()"
          (cancelEvent)="closeModal()"></modal-dialog>
        <modal-error
          *ngIf="data.type === 'error'"
          [data]="data"
          (cancelEvent)="closeModal()"></modal-error>
        <modal-media
          *ngIf="data.type === 'media'"
          [data]="data"></modal-media>
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
