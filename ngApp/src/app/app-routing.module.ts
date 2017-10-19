import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './components/main.component';
import { LoginComponent } from './components/login.component';
import { SignupComponent } from './components/signup.component';
import { UserpageComponent } from './components/userpage.component';
import { MyPageComponent } from './components/mypage.component';
import { AuthGuard }      from './guards/auth.guard';

const routes: Routes = [
  { path: '',  component: MainComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'user/:user_id', component: UserpageComponent, canActivate: [AuthGuard] },
  { path: 'mypage', component: MyPageComponent, canActivate: [AuthGuard]},
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
