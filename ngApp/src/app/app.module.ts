import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule }   from './app-routing.module';
import { AuthGuard }      from './guards/auth.guard';

import { CommonService } from './services/common.service';
import { CommonStore } from './stores/common.store';

import { MainComponent } from './components/main.component';
import { MainService } from './services/main.service';
import { MainStore } from './stores/main.store';

import { LoginComponent } from './components/login.component';
import { SignupComponent } from './components/signup.component';
import { UserPanelComponent } from './components/user_panel.component';
import { UserpageComponent } from './components/userpage.component';
import { MyPageComponent } from './components/mypage.component';
import { UserService } from './services/user.service';
import { UserStore } from './stores/user.store';

import { TweetPostComponent } from './components/tweet_post.component';
import { TweetListComponent } from './components/tweet_list.component';
import { TweetService } from './services/tweet.service';
import { TweetStore } from './stores/tweet.store';

import { HeaderComponent }  from './components/header.component';

import { FollowFollowerComponent }  from './components/follow_follower.component';

import { Modal } from './utils/modal';
import { ModalAlert } from './utils/modal';
import { ModalDialog } from './utils/modal';
import { ModalError } from './utils/modal';
import { ModalMedia } from './utils/modal';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    LoginComponent,
    SignupComponent,
    UserpageComponent,
    TweetPostComponent,
    TweetListComponent,
    MyPageComponent,
    UserPanelComponent,
    FollowFollowerComponent,
    Modal,
    ModalAlert,
    ModalDialog,
    ModalError,
    ModalMedia,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
  ],
  providers: [
    AuthGuard,
    CommonService,
    CommonStore,
    MainService,
    MainStore,
    UserService,
    UserStore,
    TweetService,
    TweetStore,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
