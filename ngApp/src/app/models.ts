
export interface ITweet {
  id: number;
  tweet: string;
  created_at: string;
  user: IUser[];
}

export interface ITweets {
  results: ITweet[];
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface ISignUpUser {
  email: string;
  username: string;
  password: string;
  profile?: string;
}

export interface IUser {
  id: number;
  email: string;
  username: string;
  profile?: string;
  is_follow?: boolean;
  is_followed?: boolean;
  follow_list?: any[];
  follower_list?: any[];
  favorite_tweet: any[];
}

export interface IModal {
  isShow: boolean;
  type: string;
  title: string;
  text: string;
  tweet: any;
  fail: boolean;
  okBtnAble: boolean;
  cancelBtnAble: boolean;
  options: any;
}
