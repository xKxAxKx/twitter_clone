import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule }   from './app-routing.module';
import { AuthGuard }      from './guards/auth.guard';

import { CommonService } from './services/common.service';

import { MainComponent } from './components/main.component';
import { MainService } from './services/main.service';
import { MainStore } from './stores/main.store';

import { LoginComponent } from './components/login.component';
import { UserService } from './services/user.service';
import { UserStore } from './stores/user.store';

import { HeaderComponent }  from './components/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    LoginComponent,
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
    MainService,
    MainStore,
    UserService,
    UserStore,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
