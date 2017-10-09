import { Component,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'modal',
  template: `
  <div>
      <section>
        <input [(ngModel)]="message" placeholder="Message">
      </section>
      <footer>
        <button (click)="onClickOk()">OK</button>
        <button (click)="onClickCancel()">Cancel</button>
      </footer>
    </div>
  `
})
export class ModalComponent {

  constructor() {
  }

  is_open:boolean = false;

  onClickOk() {
    console.log("OK")
  }

  onClickCancel() {
    console.log("Cancel")
  }
}
