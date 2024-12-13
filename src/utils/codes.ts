export const ErrorName = {
  BadRequest: 'BadRequest',
  NotFound: 'NotFound',
  Forbidden: 'Forbidden',
  TooManyRequest: 'TooManyRequest',
  BlockSave: 'BlockSave',
  SendMailIssue: 'SendMailIssue',
  Private: 'Private',
  PrivateUrl: 'PrivateUrl',
  NotProvidedUrl: 'NotProvidedUrl',
  OnlyLocalUser: 'OnlyLocalUser',
  SleepUser: 'SleepUser',
  RemovedUser: 'RemovedUser',
  AlreadyUsedEmail: 'AlreadyUsedEmail',
  CheckUserData: 'CheckUserData',
  SitemapIssue: 'SitemapIssue',
  RequiredData: 'RequiredData',
  UploadFileSize: 'UploadFileSize',
  UploadFileType: 'UploadFileType',
  NoExistsToken: 'NoExistsToken',
  ExpiredCheck: 'ExpiredCheck',
  WrongEmailFormat: 'WrongEmailFormat',
  WrongToken: 'WrongToken',
  ExpiredToken: 'ExpiredToken',
  InvalidateRequest: 'InvalidateRequest',
  InvalidateToken: 'InvalidateToken',
  ServerIssue: 'ServerIssue',
} as const;

export const ErrorCode = [
  // common
  [100, 'common'],
  // auth
  [200, 'auth'],
  // basic
  [300, 'basic'],
  // user
  [400, 'user'],
  // poll
  [500, 'poll'],
  // vote
  [600, 'vote'],
  // board
  [700, 'board'],
  // mailer
  [800, 'mailer'],
  // database
  [900, 'database'],
  // server
  [1000, 'server'],
] as const;

// ErrorCode 타입 추출
export type ErrorCodeType = typeof ErrorCode;

// export const ErrorMessage = {
//   /* common */
//   100: [
//     [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
//     [101, ErrorName.NotFound, '찾을 수 없습니다.'],
//     [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
//     [
//       103,
//       ErrorName.TooManyRequest,
//       '너무 많은 요청이 있습니다. 잠시 후 다시 시도해주세요.',
//     ],
//   ],
//   /* auth */
//   200: [
//     [100, ErrorName.CheckUserData, '회원정보를 다시 확인해주세요.'],
//     [101, ErrorName.BadRequest, '잘못된 요청입니다.'],
//     [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
//     [103, ErrorName.SendMailIssue, '이메일 발송에 문제가 생겼습니다.'],
//     [104, ErrorName.NotFound, '존재하지 않는 회원입니다.'],
//     [105, ErrorName.NoExistsToken, '존재하지 않는 토큰입니다.'],
//     [106, ErrorName.WrongToken, '잘못된 토큰 형식입니다.'],
//     [107, ErrorName.ExpiredToken, '토큰 유효기간이 만료되었습니다.'],
//     [
//       108,
//       ErrorName.ExpiredCheck,
//       '초기화 확인 시간이 만료되었습니다. 다시 시도해주세요.',
//     ],
//   ],
//   /* basic */
//   300: [[100, ErrorName.SitemapIssue, '사이트맵 생성에 문제가 생겼습니다.']],
//   /* user */
//   400: [
//     [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
//     [101, ErrorName.BlockSave, '저장할 수 없습니다.'],
//     [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
//     [103, ErrorName.AlreadyUsedEmail, '이미 사용 중인 이메일입니다.'],
//     [104, ErrorName.NotFound, '사용자를 찾을 수 없습니다.'],
//     [
//       105,
//       ErrorName.UploadFileSize,
//       '업로드 파일 크기는 10Kb이하만 가능합니다.',
//     ],
//     [
//       106,
//       ErrorName.UploadFileType,
//       '업로드 파일 타입은 jpg, png만 가능합니다.',
//     ],
//     [
//       107,
//       ErrorName.SleepUser,
//       '휴면상태입니다. 이메일 인증을 통해 계정을 활성화해주세요.',
//     ],
//     [
//       108,
//       ErrorName.RemovedUser,
//       '탈퇴한 계정입니다. 철회하시려면 관리자 메일로 문의해주세요.',
//     ],
//     [109, ErrorName.OnlyLocalUser, '사이트 회원만 가능합니다.'],
//   ],
//   /* poll */
//   500: [
//     [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
//     [101, ErrorName.BlockSave, '저장할 수 없습니다.'],
//     [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
//     [
//       103,
//       ErrorName.RequiredData,
//       '입력하지 않은 정보가 있습니다. 모두 입력해주세요.',
//     ],
//     [104, ErrorName.NotFound, '찾을 수 없습니다.'],
//     [105, ErrorName.PrivateUrl, '비공개 URL입니다.'],
//     [106, ErrorName.NotProvidedUrl, '발급되지 않은 URL입니다.'],
//   ],
//   /* vote */
//   600: [
//     [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
//     [101, ErrorName.BlockSave, '저장할 수 없습니다.'],
//     [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
//     [
//       103,
//       ErrorName.RequiredData,
//       '입력하지 않은 정보가 있습니다. 모두 입력해주세요.',
//     ],
//     [104, ErrorName.NotFound, '찾을 수 없습니다.'],
//     [105, ErrorName.PrivateUrl, '비공개 URL입니다.'],
//     [106, ErrorName.NotProvidedUrl, '발급되지 않은 URL입니다.'],
//   ],
//   /* board */
//   700: [
//     [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
//     [101, ErrorName.BlockSave, '저장할 수 없습니다.'],
//     [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
//     [
//       103,
//       ErrorName.RequiredData,
//       '입력하지 않은 정보가 있습니다. 모두 입력해주세요.',
//     ],
//     [104, ErrorName.NotFound, '찾을 수 없습니다.'],
//     [105, ErrorName.Private, '비공개 게시글입니다.'],
//   ],
//   /* mailer */
//   800: [
//     [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
//     [
//       101,
//       ErrorName.SendMailIssue,
//       '메일 발송에 실패했습니다. 이 문제가 계속해서 발생한다면 관리자에게 문의해주세요.',
//     ],
//     [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
//     [103, ErrorName.WrongEmailFormat, '이메일 형식이 틀립니다.'],
//     [
//       104,
//       ErrorName.NotFound,
//       '일치하는 사용자 정보가 없습니다. 회원가입에 사용된 이메일만 본인인증 할 수 있습니다.',
//     ],
//     [105, ErrorName.InvalidateRequest, '검증되지 않은 요청입니다.'],
//     [106, ErrorName.InvalidateToken, '유효하지 않은 토큰입니다.'],
//   ],
//   /* database */
//   900: [
//     [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
//     [101, ErrorName.ServerIssue, '데이터베이스 서버에 문제가 발생했습니다.'],
//   ],
//   1000: [
//     [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
//     [101, ErrorName.ServerIssue, '서버에 문제가 발생했습니다.'],
//     [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
//   ],
// } as const;
export const ErrorMessage = {
  /* common */
  common: [
    [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
    [101, ErrorName.NotFound, '찾을 수 없습니다.'],
    [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
    [
      103,
      ErrorName.TooManyRequest,
      '너무 많은 요청이 있습니다. 잠시 후 다시 시도해주세요.',
    ],
  ],
  /* auth */
  auth: [
    [100, ErrorName.CheckUserData, '회원정보를 다시 확인해주세요.'],
    [101, ErrorName.BadRequest, '잘못된 요청입니다.'],
    [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
    [103, ErrorName.SendMailIssue, '이메일 발송에 문제가 생겼습니다.'],
    [104, ErrorName.NotFound, '존재하지 않는 회원입니다.'],
    [105, ErrorName.NoExistsToken, '존재하지 않는 토큰입니다.'],
    [106, ErrorName.WrongToken, '잘못된 토큰 형식입니다.'],
    [107, ErrorName.ExpiredToken, '토큰 유효기간이 만료되었습니다.'],
    [
      108,
      ErrorName.ExpiredCheck,
      '초기화 확인 시간이 만료되었습니다. 다시 시도해주세요.',
    ],
  ],
  /* basic */
  basic: [[100, ErrorName.SitemapIssue, '사이트맵 생성에 문제가 생겼습니다.']],
  /* user */
  user: [
    [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
    [101, ErrorName.BlockSave, '저장할 수 없습니다.'],
    [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
    [103, ErrorName.AlreadyUsedEmail, '이미 사용 중인 이메일입니다.'],
    [104, ErrorName.NotFound, '사용자를 찾을 수 없습니다.'],
    [
      105,
      ErrorName.RequiredData,
      '입력하지 않은 정보가 있습니다. 모두 입력해주세요.',
    ],
    [106, ErrorName.CheckUserData, '회원정보를 다시 확인해주세요.'],
    [
      107,
      ErrorName.UploadFileSize,
      '업로드 파일 크기는 10Kb이하만 가능합니다.',
    ],
    [
      108,
      ErrorName.UploadFileType,
      '업로드 파일 타입은 jpg, png만 가능합니다.',
    ],
    [
      109,
      ErrorName.SleepUser,
      '휴면상태입니다. 이메일 인증을 통해 계정을 활성화해주세요.',
    ],
    [
      110,
      ErrorName.RemovedUser,
      '탈퇴한 계정입니다. 철회하시려면 관리자 메일로 문의해주세요.',
    ],
    [111, ErrorName.OnlyLocalUser, '사이트 회원만 가능합니다.'],
  ],
  /* poll */
  poll: [
    [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
    [101, ErrorName.BlockSave, '저장할 수 없습니다.'],
    [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
    [
      103,
      ErrorName.RequiredData,
      '입력하지 않은 정보가 있습니다. 모두 입력해주세요.',
    ],
    [104, ErrorName.NotFound, '찾을 수 없습니다.'],
    [105, ErrorName.PrivateUrl, '비공개 URL입니다.'],
    [106, ErrorName.NotProvidedUrl, '발급되지 않은 URL입니다.'],
  ],
  /* vote */
  vote: [
    [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
    [101, ErrorName.BlockSave, '저장할 수 없습니다.'],
    [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
    [
      103,
      ErrorName.RequiredData,
      '입력하지 않은 정보가 있습니다. 모두 입력해주세요.',
    ],
    [104, ErrorName.NotFound, '찾을 수 없습니다.'],
    [105, ErrorName.PrivateUrl, '비공개 URL입니다.'],
    [106, ErrorName.NotProvidedUrl, '발급되지 않은 URL입니다.'],
  ],
  /* board */
  board: [
    [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
    [101, ErrorName.BlockSave, '저장할 수 없습니다.'],
    [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
    [
      103,
      ErrorName.RequiredData,
      '입력하지 않은 정보가 있습니다. 모두 입력해주세요.',
    ],
    [104, ErrorName.NotFound, '찾을 수 없습니다.'],
    [105, ErrorName.Private, '비공개 게시글입니다.'],
  ],
  /* mailer */
  mailer: [
    [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
    [
      101,
      ErrorName.SendMailIssue,
      '메일 발송에 실패했습니다. 이 문제가 계속해서 발생한다면 관리자에게 문의해주세요.',
    ],
    [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
    [103, ErrorName.WrongEmailFormat, '이메일 형식이 틀립니다.'],
    [
      104,
      ErrorName.NotFound,
      '일치하는 사용자 정보가 없습니다. 회원가입에 사용된 이메일만 본인인증 할 수 있습니다.',
    ],
    [105, ErrorName.InvalidateRequest, '검증되지 않은 요청입니다.'],
    [106, ErrorName.InvalidateToken, '유효하지 않은 토큰입니다.'],
  ],
  /* database */
  database: [
    [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
    [101, ErrorName.ServerIssue, '데이터베이스 서버에 문제가 발생했습니다.'],
  ],
  server: [
    [100, ErrorName.BadRequest, '잘못된 요청입니다.'],
    [101, ErrorName.ServerIssue, '서버에 문제가 발생했습니다.'],
    [102, ErrorName.Forbidden, '접근 권한이 없습니다.'],
  ],
} as const;
// export type ReverseErrorMessageType = typeof ReverseErrorMessage;

export type ErrorMessageType = typeof ErrorMessage;

// // 특정 도메인에 해당하는 숫자 기반 코드 추출
// export type CodeForDomain<T extends ErrorCodeType[number][1]> =
//   ErrorCodeType[number] extends [infer C, T] ? C : never;

// // 숫자 기반 코드에 해당하는 에러 메시지 추출
// export type ErrorMessagesForCode<C extends keyof ErrorMessageType> =
//   ErrorMessageType[C][number][1];

// // 텍스트 기반 `code`로 에러 메시지 추출
// export type ErrorMessagesForText<T extends ErrorCodeType[number][1]> =
//   ErrorMessagesForCode<CodeForDomain<T>>;

// // 전체 타입 매핑
// export type MessageForCode<T> = T extends ErrorCodeType[number][1]
//   ? ErrorMessagesForText<T>
//   : T extends keyof ErrorMessageType
//     ? ErrorMessagesForCode<T>
//     : never;

// export type MatchError<Index extends keyof ErrorMessageType> =
//   ErrorMessageType[Index][number][1];

// type a = MatchError<100>;
