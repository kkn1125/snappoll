export const CustomMessage = {
  Login: { title: '안내', content: '로그인이 필요합니다.' },
  Logout: { title: '안내', content: '로그아웃 되었습니다.' },
  Token: { title: '안내', content: '토큰이 만료되었습니다.' },
  NoDeleteOne: { title: '안내', content: '최소 하나의 질문은 있어야합니다.' },
  ServerError: { title: '서버 안내', content: '서버에서 문제가 발생했습니다.' },
} as const;
export type CustomMessage = (typeof CustomMessage)[keyof typeof CustomMessage];

export const MessageFactory = (message: {
  title: string;
  content: string;
}): MessageTemplate => message;

export const Expired = {
  Token: CustomMessage.Token,
} as const;
export type Expired = (typeof Expired)[keyof typeof Expired];

export const Require = {
  Login: CustomMessage.Login,
  Logout: CustomMessage.Logout,
} as const;
export type Require = (typeof Require)[keyof typeof Require];

export const Info = {
  NoDeleteOne: CustomMessage.NoDeleteOne,
  ServerError: CustomMessage.ServerError,
} as const;
export type Info = (typeof Info)[keyof typeof Info];

export const Single = {
  Remove: '정말로 삭제하시겠습니까?',
} as const;
export type Single = (typeof Single)[keyof typeof Single];

type MessageFactory = {
  title: string;
  content: string;
};

export const Message = {
  Single,
  WrongRequest: (content: string) => ({ title: '잘못된 요청', content }),
  Require,
  Expired,
  Info,
} as const;
export type Message = (typeof Message)[keyof typeof Message];
