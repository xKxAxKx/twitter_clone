import { Component, Input, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';

import { MainService } from '../services/main.service';
import { TweetService } from '../services/tweet.service';
import { TweetStore } from '../stores/tweet.store';
import { UserStore } from '../stores/user.store';
import { Modal }  from '../utils/modal';
// import { SearchValueInListPipe } from '../utils/searchvalueinlist.pipe';

import { IModal } from '../models';


@Component({
  selector: 'tweet-list',
  template: `
    <div *ngIf="tweetStore.tweetlist">
      <div *ngFor="let tweet of tweetStore.tweetlist.results">
        <div class="panel panel-primary">
          <div class="panel-body">
            <p>
              <a [routerLink]="['/user', tweet.user.id]">@{{ tweet.user.username }}</a>
              <span>{{ tweet.created_at | date: 'yyyy/MM/dd hh:mm:ss' }}</span>
              <a (click)="getTweetDetail(tweet)" class="cursor_pointer">Detail</a>
              <a (click)="addFavorite(tweet)" class="cursor_pointer" *ngIf="userStore.loginUserFavList.indexOf(tweet.id) < 0">
                ☆
              </a>
              <a (click)="deleteFavorite(tweet)" class="cursor_pointer" *ngIf="userStore.loginUserFavList.indexOf(tweet.id) >= 0" style="color:#ff0000;">
                ★
              </a>
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
  `,
})
export class TweetListComponent {

  // モーダル
  @ViewChild(Modal) modal;

  // お気に入り一覧か否か
  @Input() isFavList:boolean = false;

  constructor (
    private tweetService: TweetService,
    private tweetStore: TweetStore,
    private activatedRoute: ActivatedRoute,
    private userStore: UserStore,
  ){
    activatedRoute.params.subscribe((params: Params) => {
      if(params['user_id']) {
        this.getFollowTweet = false;
        this.user_id = params['user_id']
      } else {
        this.getFollowTweet = true;
      }
    });
  }

  getFollowTweet: boolean;

  user_id = null;

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
        this.tweetService.deleteTweetByTweetId(tweet.id, this.user_id,
                                               this.getFollowTweet, this.isFavList);
      },
      // ツイート削除しましたに対してOKを押した時
      () => {
        this.closeModal();
      }
    );
  }

  addFavorite(tweet) {
    this.dialogData.type = 'dialog';
    this.dialogData.isShow = true;
    this.dialogData.title = 'Add Favorite';
    this.dialogData.text = `Add Favorite.<br>Is it OK?`;
    this.dialogData.okBtnAble = true;
    this.dialogData.cancelBtnAble = true;

    this.modal.openModal(
      () => {
        this.dialogData.text = "Adding Favorite..."
        this.dialogData.okBtnAble = false;
        this.dialogData.cancelBtnAble = false;
        this.tweetService.AddFavoriteTweet(tweet, this.user_id, this.isFavList);
      },
      // 確認に対してOKを押した時
      () => {
        this.closeModal();
      }
    );
  }

  deleteFavorite(tweet) {
    this.dialogData.type = 'dialog';
    this.dialogData.isShow = true;
    this.dialogData.title = 'Delete Favorite';
    this.dialogData.text = `Delete Favorite.<br>Is it OK?`;
    this.dialogData.okBtnAble = true;
    this.dialogData.cancelBtnAble = true;

    this.modal.openModal(
      () => {
        this.dialogData.text = "Deleting Favorite..."
        this.dialogData.okBtnAble = false;
        this.dialogData.cancelBtnAble = false;
        this.tweetService.deleteFavoriteTweet(tweet, this.user_id, this.isFavList);
        console.log(tweet);
      },
      // 確認に対してOKを押した時
      () => {
        this.closeModal();
      }
    );
  }

  getTweetDetail(tweet) {
    this.dialogData.isShow = true;
    this.dialogData.tweet = tweet;
    this.dialogData.type = 'tweet';
    console.log(tweet)
  }

  closeModal() {
    /*
     * モーダルの内容を設定
     */
    this.dialogData.isShow = false;
    this.dialogData.title = '';
    this.dialogData.tweet = {};
    this.dialogData.okBtnAble = false;
    this.dialogData.cancelBtnAble = false;

    this.modal.resetAll();
  }
}
