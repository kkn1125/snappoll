export const CustomMessage = {
  Login: { title: '안내', content: '로그인이 필요합니다.' },
  Logout: { title: '안내', content: '로그아웃 되었습니다.' },
  Token: { title: '안내', content: '토큰이 만료되었습니다.' },
  SuccessCheckMail: {
    title: '안내',
    content: ['본인 확인이 완료되었습니다.', '나머지 항목을 입력해주세요.'],
  },
  SuccessChangeProfile: {
    title: '안내',
    content: ['개인정보를 변경했습니다.'],
  },
  SuccessResponse: {
    title: '안내',
    content: [
      '응답을 성공적으로 제출했습니다. 확인을 누르면 사이트로 이동, 닫기를 누르면 창이 종료됩니다.',
      '사이트로 이동하시겠습니까?',
    ],
  },
  SuccessChangePassword: {
    title: '안내',
    content: ['비밀번호를 변경하였습니다.'],
  },
  CheckYourEmail: {
    title: '안내',
    content: '메일을 전송하였습니다. 입력하신 이메일의 수신함을 확인해주세요.',
  },
  CreateShareUrl: { title: '안내', content: '공개 URL이 생성되었습니다.' },
  ResumeShareUrl: { title: '안내', content: '공개 URL이 복구되었습니다.' },
  RevokeShareUrl: { title: '안내', content: '공개 URL이 정지되었습니다.' },
  NoDeleteOne: { title: '안내', content: '최소 하나의 질문은 있어야합니다.' },
  LeastResponse: { title: '안내', content: '최소 한 개 이상 응답해야합니다.' },
  MustFill: { title: '안내', content: '필수 질문을 완성해주세요.' },
  ServerEConnection: {
    title: '서버 안내',
    content:
      '서버 연결이 원활하지 않습니다. 계속 같은 현상이 반복된다면 관리자에게 문의해주세요.',
  },
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
  LeastResponse: CustomMessage.LeastResponse,
  MustFill: CustomMessage.MustFill,
} as const;
export type Require = (typeof Require)[keyof typeof Require];

export const Info = {
  CheckYourEmail: CustomMessage.CheckYourEmail,
  SuccessCheckMail: CustomMessage.SuccessCheckMail,
  SuccessChangeProfile: CustomMessage.SuccessChangeProfile,
  SuccessChangePassword: CustomMessage.SuccessChangePassword,
  SuccessResponse: CustomMessage.SuccessResponse,
  CreateShareUrl: CustomMessage.CreateShareUrl,
  ResumeShareUrl: CustomMessage.ResumeShareUrl,
  RevokeShareUrl: CustomMessage.RevokeShareUrl,
  NoDeleteOne: CustomMessage.NoDeleteOne,
  ServerEConnection: CustomMessage.ServerEConnection,
  ServerError: CustomMessage.ServerError,
} as const;
export type Info = (typeof Info)[keyof typeof Info];

export const Single = {
  Redirect: '변경사항이 저장되지 않을 수 있습니다',
  Save: '이대로 저장하시겠습니까?',
  Remove: '정말로 삭제하시겠습니까?',
  LeaveAlert: [
    '탈퇴 승인 시점부터 계정은 사용할 수 없으며, 10일이 지나면 모든 데이터가 완전히 소멸됩니다. 복구를 원하시면 문의하기에서 1~2일 내로 탈퇴 신청을 철회할 수 있습니다.',
    '진행하시겠습니까?',
  ],
} as const;
export type Single = (typeof Single)[keyof typeof Single];

export const Wrong = {
  Required: '필수입니다.',
  Username: '유저 닉네임은 최소 4자이상, 15자이하입니다.',
  EmailFormat: '이메일 형식이 잘못되었습니다.',
  Password: '패스워드는 최소 5자이상, 12자이하입니다.',
  PasswordFormat:
    '패스워드 형식은 영문(소문자, 대문자), 숫자, 특수문자(!@#$%^&*./?-+)가 1개 이상으로 총 5~12자로 작성해야합니다.',
  CheckPassword: '비밀번호를 정확히 입력해주세요.',
} as const;
export type Wrong = (typeof Wrong)[keyof typeof Wrong];

type MessageFactory = {
  title: string;
  content: string;
};

export const Message = {
  Single,
  WrongRequest: (content: string) => ({ title: '잘못된 요청', content }),
  Wrong,
  Require,
  Expired,
  Info,
} as const;
export type Message = (typeof Message)[keyof typeof Message];
