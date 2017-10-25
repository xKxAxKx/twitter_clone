import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable, Subject } from 'rxjs';

import { CommonService } from './common.service';
import { UserStore } from '../stores/user.store';

@Injectable()
export class TweetService {

  private PostTweetApi = `http://127.0.0.1:8000/api/tweet/post/`;
  private GetTweetListByUserIds = `http://127.0.0.1:8000/api/tweet/list/`;
  private DeleteTweetByTweetIdApi = `http://127.0.0.1:8000/api/tweet/delete/`;
  private AddFavoriteByTweetIdApi = `http://127.0.0.1:8000/api/favorite/add/`;

  // ツイートのPostが成功した時のSubject
  // tweet.storeとcommon.storeに送る
  completePostTweetSubject: Subject<any> = new Subject<any>();

  // ツイートのPostが失敗した時のSubject
  // tweet.storeとcommon.storeに送る
  errorPostTweetSubject: Subject<any> = new Subject<any>();

  // ツイートリストの取得が成功した時のSubject
  // tweet.storeに送る
  fetchTweetListSubjct: Subject<any> = new Subject<any>();

  // ツイートのDeleteが成功した時のSubject
  // tweet.storeとcommon.storeに送る
  completeDeleteTweetSubject: Subject<any> = new Subject<any>();

  // ツイートのDeleteが失敗した時のSubject
  // tweet.storeとcommon.storeに送る
  errorDeleteTweetSubject: Subject<any> = new Subject<any>();

  constructor(
    private http: Http,
    private router: Router,
    private commonService: CommonService,
    private userStore: UserStore,
  ){}


  // Tweetをpostする
  postTweet(postData, getFollowTweet) {
    return this.http
      .post(this.PostTweetApi, postData, this.commonService.jwt())
      .map((res) => res.json())
      .subscribe(
        (res) => {
          this.getTweetByUserIds(this.userStore.loginUserInfo.id, getFollowTweet);
          this.completePostTweetSubject.next(res.tweet);
        },
        (err) => {
          this.errorPostTweetSubject.next();
        }
      );
  }

  // 指定したuser_idのツイートをgetする
  // getFollowTweetがTrueだったらフォローしているユーザのツイートも取得
  getTweetByUserIds(users, getFollowTweet) {
    let params = new URLSearchParams();
    params.set("users", users);
    if(getFollowTweet) {
      params.set("get_follow_tweet", getFollowTweet)
    };

    return this.http
      .get(this.GetTweetListByUserIds, {search: params})
      .map(res => res.json())
      .subscribe(
        (res) => {
          this.fetchTweetListSubjct.next(res);
        },
        (err) => {
          console.log("ツイートリストの取得に失敗");
        }
      );
  }

  // 指定したtweet_idのツイートを削除
  // トップページか否かで再読み込みするツイートを選択
  deleteTweetByTweetId(tweet_id:number, getFollowTweet:boolean) {
    return this.http
      .delete(this.DeleteTweetByTweetIdApi + tweet_id, this.commonService.jwt())
      .subscribe(
        (res) => {
          // ツイートのリストを再読み込みしておく
          this.getTweetByUserIds(this.userStore.loginUserInfo.id, getFollowTweet);
          this.completeDeleteTweetSubject.next(res);
        },
        (err) => {
          this.errorDeleteTweetSubject.next();
        }
      );
  }

  // 指定したツイートをお気に入りに追加
  AddFavoriteTweet(tweet) {
    return this.http
      .post(this.AddFavoriteByTweetIdApi, tweet, this.commonService.jwt())
      .map(res => res.json())
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
