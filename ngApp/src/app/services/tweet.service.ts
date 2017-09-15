import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs';

import { CommonService } from './common.service';

@Injectable()
export class TweetService {

  private PostTweetApi = `http://127.0.0.1:8000/api/tweet/post/`

  // ツイートのPostが成功した時のSubject
  // tweet.storeとcommon.storeに送る
  completePostTweetSubject: Subject<any> = new Subject<any>();

  // ツイートのPostが失敗した時のSubject
  // tweet.storeとcommon.storeに送る
  errorPostTweetSubject: Subject<any> = new Subject<any>();

  constructor(
    private http: Http,
    private router: Router,
    private commonService: CommonService,
  ){}


  // Tweetをpostする
  postTweet(postData) {
    console.log(postData);
    return this.http
      .post(this.PostTweetApi, postData, this.commonService.jwt())
      .map((res) => res.json())
      .subscribe(
        (res) => {
          this.completePostTweetSubject.next(res.tweet);
        },
        (err) => {
          this.errorPostTweetSubject.next();
        }
      );
  }

}
