import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <header header></header>
    <div class="container">
      <div class="center">
        <div class="row">
        <div class="alert alert-danger">
          {{ ErrorMessage }}
        </div>
        <div class="alert alert-success">
          {{ ValidMessage }}
        </div>
        </div>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  ngOnInit() {
  }
}
