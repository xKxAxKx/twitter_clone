import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './components/main.component';
import { LoginComponent } from './components/login.component';
import { SignupComponent } from './components/signup.component';
import { UserpageComponent } from './components/userpage.component';
import { MyPageComponent } from './components/mypage.component';
import { TweetDetailComponent } from './components/tweet_detail.component';
import { FollowFollowerComponent } from './components/follow_follower.component';
import { AuthGuard }      from './guards/auth.guard';

const routes: Routes = [
  { path: '',  component: MainComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'user/:user_id', component: UserpageComponent, canActivate: [AuthGuard] },
  { path: 'user/:user_id/follow_list', component: UserpageComponent, canActivate: [AuthGuard] },
  { path: 'user/:user_id/follower_list', component: UserpageComponent, canActivate: [AuthGuard] },
  { path: 'user/:user_id/fav_list', component: UserpageComponent, canActivate: [AuthGuard] },
  { path: 'tweet/:tweet_id', component: TweetDetailComponent, canActivate: [AuthGuard] },
  { path: 'mypage', component: MyPageComponent, canActivate: [AuthGuard]},
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
