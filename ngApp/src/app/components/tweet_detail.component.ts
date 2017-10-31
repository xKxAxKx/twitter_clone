import {
          Component,
          EventEmitter,
          Input,
          Output,
          Injectable
        } from '@angular/core';
import { Observable, Subject } from 'rxjs';


import { TweetService } from '../services/tweet.service';
import { TweetStore } from '../stores/tweet.store';
import { UserService } from '../services/user.service';
import { UserStore } from '../stores/user.store';
import { Modal }  from '../utils/modal';


@Component({
  selector: 'tweetDetail',
  template: `
  <div class="mod-Modal">
  </div>
  `
})
export class TweetDetailComponent {

  constructor (
    private userStore: UserStore,
    private userService: UserService,
    private tweetService: TweetService,
    private tweetStore: TweetStore,

  ){
  }

}
