import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { TweetService } from '../services/tweet.service';

@Injectable()
export class TweetStore {

  constructor (
    private tweetService: TweetService,
  ) {
    
  }
}
