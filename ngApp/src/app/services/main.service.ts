import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class MainService {
  loginTokenName = 'twitter_clone_token';
  loginToken: any;

  jwt() {
    this.loginToken = localStorage.getItem(this.loginTokenName);
    console.log(this.loginToken);
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'JWT ' + this.loginToken.token });
    return new RequestOptions({ headers: headers });
  }
}
