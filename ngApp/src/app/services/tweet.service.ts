import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable, Subject } from 'rxjs';

import { CommonService } from './common.service';
import { UserStore } from '../stores/user.store';
import { UserService } from './user.service';

@Injectable()
export class TweetService {

  private PostTweetApi = `http://127.0.0.1:8000/api/tweet/post/`;
  private GetTweetListByUserIds = `http://127.0.0.1:8000/api/tweet/list/`;
  private DeleteTweetByTweetIdApi = `http://127.0.0.1:8000/api/tweet/delete/`;
  private AddFavoriteByTweetIdApi = `http://127.0.0.1:8000/api/favorite/add/`;
  private DeleteFavoriteByTweetIdApi = `http://127.0.0.1:8000/api/favorite/delete/`;

  // ツイートのPostが成功した時のSubject
  completePostTweetSubject: Subject<any> = new Subject<any>();

  // ツイートのPostが失敗した時のSubject
  errorPostTweetSubject: Subject<any> = new Subject<any>();

  // ツイートリストの取得が成功した時のSubject
  fetchTweetListSubjct: Subject<any> = new Subject<any>();

  // ツイートのDeleteが成功した時のSubject
  completeDeleteTweetSubject: Subject<any> = new Subject<any>();

  // ツイートのDeleteが失敗した時のSubject
  errorDeleteTweetSubject: Subject<any> = new Subject<any>();

  // ツイートのお気に入り追加が成功した時のSubject
  successAddFavoriteSubject: Subject<any> = new Subject<any>();

  // ツイートのお気に入り追加が失敗した時のSubject
  errorAddFavoriteSubject: Subject<any> = new Subject<any>();

  // ツイートのお気に入り削除が成功した時のSubject
  successDeleteFavoriteSubject: Subject<any> = new Subject<any>();

  // ツイートのお気に入り削除が失敗した時のSubject
  errorDeleteFavoriteSubject: Subject<any> = new Subject<any>();

  constructor(
    private http: Http,
    private router: Router,
    private commonService: CommonService,
    private userStore: UserStore,
    private userService: UserService,
  ){}


  // Tweetをpostする
  // postしたページによって再読み込みするデータが異なってくるので注意
  postTweet(postData:any, getFollowTweet:boolean,
            user_id:number=null, isFavList:boolean=false) {
    return this.http
      .post(this.PostTweetApi, postData, this.commonService.jwt())
      .map((res) => res.json())
      .subscribe(
        (res) => {
          if (user_id) {
            if (isFavList) {
              // 当該ユーザのfav一覧の更新
              this.userService.FetchFavoriteTweet(user_id, false);
            } else {
              // 当該のユーザのツイート一覧を更新
              this.getTweetByUserIds(user_id, false);
            }
          } else {
            // 自分のタイムラインの更新
            this.getTweetByUserIds(this.userStore.loginUserInfo.id, getFollowTweet);
          }
          this.completePostTweetSubject.next(res.tweet);
        },
        (err) => {
          this.errorPostTweetSubject.next();
        }
      );
  }

  // 指定したuser_idのツイートをgetする
  // getFollowTweetがTrueだったらフォローしているユーザのツイートも取得
  getTweetByUserIds(user, getFollowTweet) {
    let params = new URLSearchParams();
    params.set("user", user);
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
  // favlistページの場合は、favlistを再読み込みする
  deleteTweetByTweetId(tweet_id:number, user_id:any,
                       getFollowTweet:boolean, isFavList:boolean=false) {
    return this.http
      .delete(this.DeleteTweetByTweetIdApi + tweet_id, this.commonService.jwt())
      .subscribe(
        (res) => {
          // ツイートのリストを再読み込みしておく
          if(isFavList) {
            this.userService.FetchFavoriteTweet(user_id, false);
          } else {
            this.getTweetByUserIds(this.userStore.loginUserInfo.id, getFollowTweet);
          }
          this.completeDeleteTweetSubject.next(res);
        },
        (err) => {
          this.errorDeleteTweetSubject.next();
        }
      );
  }

  // 指定したツイートをお気に入りに追加
  AddFavoriteTweet(tweet, user_id:number, isFavList:boolean=false) {
    return this.http
      .post(this.AddFavoriteByTweetIdApi + tweet.id, tweet, this.commonService.jwt())
      .map(res => res.json())
      .subscribe(
        (res) => {
          if(user_id) {
            if(isFavList) {
              this.userService.FetchFavoriteTweet(user_id, false);
            } else {
              this.getTweetByUserIds(user_id, false);
            }
          } else {
            this.getTweetByUserIds(this.userStore.loginUserInfo.id, true);
          }
          this.userService.FetchFavoriteTweet(this.userStore.loginUserInfo.id, true);
          this.successAddFavoriteSubject.next(res);
        },
        (err) => {
          console.log(err);
          this.errorAddFavoriteSubject.next(err);
        }
      );
  }

  // 指定したツイートをお気に入りから削除
  deleteFavoriteTweet(tweet, user_id:number, isFavList:boolean=false) {
    return this.http
      .delete(this.DeleteFavoriteByTweetIdApi + tweet.id, this.commonService.jwt())
      .subscribe(
        (res) => {
          if(user_id) {
            if (isFavList) {
              this.userService.FetchFavoriteTweet(user_id, false);
            } else {
              this.getTweetByUserIds(user_id, false);
            }
          } else {
            this.getTweetByUserIds(this.userStore.loginUserInfo.id, true);
          }
          this.userService.FetchFavoriteTweet(this.userStore.loginUserInfo.id, true);
          this.successDeleteFavoriteSubject.next(res);
        },
        (err) => {
          this.errorDeleteFavoriteSubject.next(err);
        }
      );
  }

}
