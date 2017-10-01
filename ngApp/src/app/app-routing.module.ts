import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './components/main.component';
import { LoginComponent } from './components/login.component';
import { SignupComponent } from './components/signup.component';
import { UserpageComponent } from './components/userpage.component';
import { MyPageComponent } from './components/mypage.component';

const routes: Routes = [
  { path: '',  component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'user/:user_id', component: UserpageComponent },
  { path: 'mypage', component: MyPageComponent },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
