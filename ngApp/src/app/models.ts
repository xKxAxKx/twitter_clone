export interface IModal {
  isShow: boolean;
  type: string;
  title: string;
  text: string;
  fail: boolean;
  okBtnAble: boolean;
  cancelBtnAble: boolean;
}

export interface ILoginUser {
  email: string;
  password: string;
};

export interface ISignUpUser {
  email: string;
  username: string;
  password: string;
  profile?: string;
};
