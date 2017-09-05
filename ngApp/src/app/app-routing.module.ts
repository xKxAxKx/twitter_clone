import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './components/main.component';
import { LoginComponent } from './components/login.component';

const routes: Routes = [
  { path: '',  component: MainComponent },
  { path: 'login', component: LoginComponent },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
