import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable, Subject } from 'rxjs';

import { CommonService } from './common.service';

@Injectable()
export class TweetService {

  private PostTweetApi = `http://127.0.0.1:8000/api/tweet/post/`;
  private GetTweetListByUserIds = `http://127.0.0.1:8000/api/tweet/list/`;

  // ツイートのPostが成功した時のSubject
  // tweet.storeとcommon.storeに送る
  completePostTweetSubject: Subject<any> = new Subject<any>();

  // ツイートのPostが失敗した時のSubject
  // tweet.storeとcommon.storeに送る
  errorPostTweetSubject: Subject<any> = new Subject<any>();

  // ツイートリストの取得が成功した時のSubject
  // tweet.storeに送る
  fetchTweetListSubjct: Subject<any> = new Subject<any>();

  constructor(
    private http: Http,
    private router: Router,
    private commonService: CommonService,
  ){}


  // Tweetをpostする
  postTweet(postData) {
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

  // 指定したuser_id(複数でもOK)のツイートをgetする
  getTweetByUserIds(users) {
    let params = new URLSearchParams();
    params.set("users", users);

    return this.http
      .get(this.GetTweetListByUserIds, {search: params})
      .subscribe(
        (res) => {
          this.fetchTweetListSubjct.next(res);
        },
        (err) => {
          console.log("ツイートリストの取得に失敗");
        }
      );

  }

}
