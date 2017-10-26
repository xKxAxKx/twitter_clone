import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { TweetService } from '../services/tweet.service';

import { ITweet, ITweets, IModal } from '../models';

@Injectable()
export class TweetStore {

  // 取得したツイートのリスト
  tweetlist: ITweets = {} as ITweets;

  // モーダルの情報
  modalData: IModal = {
    isShow: false,
    type: 'dialog',
    title: '',
    text: '',
    fail: false,
    okBtnAble: false,
    cancelBtnAble: false,
  } as IModal;


  constructor (
    private tweetService: TweetService,
  ) {
    this.tweetService.fetchTweetListSubjct.subscribe(
      (res) => {
        this.tweetlist.results = res;
    });

    this.tweetService.completeDeleteTweetSubject.subscribe(
      (res) => {
        this.modalData.text = `Tweet Deleted!`;
        this.modalData.okBtnAble = true;
      }
    );

    this.tweetService.errorDeleteTweetSubject.subscribe(
      (res) => {
        this.modalData.text = `Failed Tweet deleted...`;
        this.modalData.okBtnAble = true;
      }
    );

    this.tweetService.successAddFavoriteSubject.subscribe(
      (res) => {
        this.modalData.text = `Add Favorite!`;
        this.modalData.okBtnAble = true;
      }
    );

    this.tweetService.errorAddFavoriteSubject.subscribe(
      (err) => {
        this.modalData.text = `Failed add Favorite...`;
        this.modalData.okBtnAble = true;
      }
    );
  }
}
