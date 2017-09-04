import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule }   from './app-routing.module';
import { AuthGuard }      from './guards/auth.guard';

import { MainComponent } from './components/main.component';
import { MainService } from './services/main.service';
import { MainStore } from './stores/main.store';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    MainService,
    MainStore,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
