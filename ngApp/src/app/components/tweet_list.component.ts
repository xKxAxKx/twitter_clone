import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MainService } from '../services/main.service';
import { TweetService } from '../services/tweet.service';
import { TweetStore } from '../stores/tweet.store';
import { UserStore } from '../stores/user.store';

import { Modal }  from '../utils/modal';

import { IModal } from '../models';

@Component({
  selector: 'tweet-list',
  template: `
    <div *ngIf="tweetStore.tweetlist">
      <div *ngFor="let tweet of tweetStore.tweetlist">
        <div class="panel panel-primary">
          <div class="panel-body">
            <p>
              <a [routerLink]="['/user', tweet.user.id]">@{{ tweet.user.username }}</a>
              <span>{{ tweet.created_at | date: 'yyyy/MM/dd hh:mm:ss' }}</span>
              <span>Reply</span>
              <span>Retweet</span>
              <span>Favorite</span>
              <a (click)="deleteTweet(tweet)" class="cursor_pointer" *ngIf="tweet.user.id === userStore.loginUserInfo.id">Delete</a>
            </p>
            {{ tweet.tweet }}
          </div>
        </div>
      </div>
    </div>
    <modal
      [data]="this.tweetStore.modalData"
      (cancelEvent)="closeModal()"></modal>
  `
})
export class TweetListComponent {

  // モーダル
  @ViewChild(Modal) modal;

  constructor (
    private tweetService: TweetService,
    private tweetStore: TweetStore,
    private activatedRoute: ActivatedRoute,
    private userStore: UserStore,
  ){}

  users = null;

  get dialogData(): IModal {
    return this.tweetStore.modalData;
  }

  ngOnInit() {
  }

  deleteTweet(tweet) {
    this.dialogData.isShow = true;
    this.dialogData.title = 'Delete your Tweet';
    this.dialogData.text = `Delete Tweet "${tweet.tweet}".<br>Is it OK?`;
    this.dialogData.okBtnAble = true;
    this.dialogData.cancelBtnAble = true;

    this.modal.openModal(
      // ツイート削除に対してOKを押した時
      () => {
        this.dialogData.text = "Deleting Tweet..."
        this.dialogData.okBtnAble = false;
        this.dialogData.cancelBtnAble = false;

        console.log(this.dialogData);
      },
      // ツイート削除しましたに対してOKを押した時
      () => {
        this.closeModal();
      }
    );
  }

  closeModal() {
    /*
     * モーダルの内容を設定
     */
    this.dialogData.isShow = false;
    this.dialogData.title = '';
    this.dialogData.text = '';
    this.dialogData.okBtnAble = false;
    this.dialogData.cancelBtnAble = false;

    this.modal.resetAll();
  }


}
