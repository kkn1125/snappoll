import '@mui/material/styles';
import '@mui/material/Button';
import '@mui/material/AppBar';

export declare module '@mui/material/styles' {
  export declare interface Palette {
    sky: Palette['primary'];
    marketing: Palette['primary'];
  }
  export declare interface PaletteOptions {
    sky?: PaletteOptions['primary'];
    marketing?: PaletteOptions['primary'];
  }

  export declare interface TypeBackground {
    marketing?: string;
  }
}

export declare module '@mui/material/Button' {
  export interface ButtonPropsColorOverrides {
    sky: true;
    marketing: true;
  }
}

export declare module '@mui/material/AppBar' {
  export interface AppBarPropsColorOverrides {
    sky: true;
    marketing: true;
  }
}

// TypeScript가 새로운 네임스페이스를 인식할 수 있도록 빈 export 추가
export declare global {
  export type TextPollType = {
    type: 'text';
    default: string;
    value: string;
    items: never[];
  };

  export type OptionPollType = {
    type: 'option';
    default: string;
    value: string;
    items: {
      name: string;
      value: string;
    }[];
  };

  export type CheckboxPollType = {
    type: 'checkbox';
    default: string;
    value: boolean;
    items: {
      name: string;
      checked?: boolean;
    }[];
  };

  export type PollType = TextPollType | OptionPollType | CheckboxPollType;

  export type InferPollDefault<T> = T extends infer D
    ? D extends 'text'
      ? string
      : D extends 'option'
        ? string
        : D extends 'checkbox'
          ? boolean
          : never
    : never;

  interface BasePoll {
    name: string;
    desc?: string;
    label: string;
    required?: boolean;
  }
  interface LoginDto {
    email: string;
    password: string;
  }
  interface SnapResponseType<T = object> {
    ok: boolean;
    data: T;
  }
  interface Feature {
    id: string;
    planId: string;
    feature: string;
    createdAt: Date;
    updatedAt: Date;
  }
  interface Plan {
    id: string;
    name: string;
    description: string;
    planType: 'Free' | 'Basic' | 'Premium' | 'Enterprise';
    price: number;
    createdAt: Date;
    updatedAt: Date;
    subscription?: Subscription[];
    feature?: Feature[];
  }
  type Role = 'Admin' | 'User';
  type ExpandedRole = 'Admin' | 'User' | 'Guest';
  interface User {
    id: string;
    email: string;
    username: string;
    isActive: boolean;
    lastLogin: Date;
    authProvider: 'Kakao' | 'Google' | 'Local';
    role: Role;
    // grade: 'Free' | 'Hobby' | 'Pro';
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    userProfile?: Profile;
    subscription: Subscription;
  }
  interface Subscription {
    id: string;
    userId: string;
    planId: string;
    type: 'Monthly' | 'Yearly' | 'Infinite';
    state: 'Active' | 'Cancelled' | 'Expired';
    startDate: Date;
    endDate: Date;
    user?: User;
    plan?: Plan;
  }
  interface Plan {
    id: string;
    name: string;
    description?: string;
    planType: 'Free' | 'Basic' | 'Pro' | 'Premium';
    price: number;
    createdAt: Date;
    updatedAt: Date;
    subscription?: Subscription[];
    feature?: Feature[];
  }
  interface UserPoll {
    id: string;
    title: string;
    description: string;
    options: string;
    createdBy: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  interface Feature {
    id: string;
    planId: string;
    feature: string;
    createdAt: Date;
    updatedAt: Date;
    plan?: Plan;
  }
  type SnapCommentAddDto = Omit<
    SnapComment,
    | 'id'
    | 'order'
    | 'likeCount'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'user'
  >;
  interface SnapComment {
    id: number;
    boardId: string;
    userId: string;
    content: string;
    isAuthorOnly: boolean;
    group: number;
    layer: number;
    order: number;
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

    user: User;
  }
  interface Profile {
    id: string;
    userId: string;
    image: string;
    createdAt: Date;
  }
  interface SignupUser {
    email: string;
    username: string;
    password: string;
    checkPassword: string;
    privacyPolicy: boolean;
    serviceAgreement: boolean;
  }
  // interface LoginUser
  //   extends Omit<User, 'id' | 'username' | 'createdAt' | 'updatedAt'> {}
  type ErrorMessage<T = object> = Partial<{ [k in keyof T]: string }>;
  interface ErrorCode {
    status: number;
    errorStatus: number;
    domain: string;
    message: string;
  }
  interface AxiosException {
    httpCode: number;
    path: string;
    timestamp: string;
    errorCode: ErrorCode;
  }
  interface UserToken {
    user?: User;
  }
  interface Vote {
    id: string;
    userId: string;
    pollId: string;
    title: string;
    content: string;
    options: string;
    createdAt: Date;
    updatedAt: Date;
    user?: User;
    voteResult?: VoteResult;
  }

  interface VoteOptionItem {
    name: string;
    checked: boolean;
    value?: string;
  }

  interface VoteResult {
    id: string;
    userId: string;
    pollId?: string;
    title: string;
    content: string;
    options: string;
    createdAt: Date;
    updatedAt: Date;
  }
  interface MessageTemplate {
    title: string;
    content: string | readonly string[];
  }
  interface DateTemplate {
    createdAt: Date;
    updatedAt: Date;
  }
  interface Poll extends DateTemplate {
    id: string;
    title: string;
    description: string;
    createdBy: string;
    expiresAt: Date;
    question: Question[];
  }
  interface Question {
    id: string;
    pollId: string;
    type: string;
    title: string;
    description: string;
    order: number;
    isMultiple: boolean;
    option: Option[];
  }
  interface Option {
    id: string;
    voteId: string;
    questionId: string;
  }

  interface PollOption {
    id: number;
    pollId: string;
    type: string;
  }

  interface OptionItem {
    id: number;
    voteOptionId: number;
    pollOptionId: number;
    value: string;
    checked: boolean;
  }

  type CreateOmitType = 'id' | keyof DateTemplate;

  interface WindowEventMap {
    watch: WatchEvent;
  }

  interface WatchEventDetail {
    path?: string;
    reload?: boolean;
  }

  type WatchEvent = CustomEvent<WatchEventDetail>;

  /**
   * Generate a set of string literal types with the given default record `T` and
   * override record `U`.
   *
   * If the property value was `true`, the property key will be added to the
   * string union.
   *
   * @internal
   */
  export type OverridableStringUnion<
    T extends string | number,
    U = {},
  > = GenerateStringUnion<Overwrite<Record<T, true>, U>>;

  /**
   * Like `T & U`, but using the value types from `U` where their properties overlap.
   *
   * @internal
   */
  export type Overwrite<T, U> = DistributiveOmit<T, keyof U> & U;

  type GenerateStringUnion<T> = Extract<
    {
      [Key in keyof T]: true extends T[Key] ? Key : never;
    }[keyof T],
    string
  >;

  type TrackForm<T extends Format> = Record<T['name'], string>;

  interface Format {
    name: string;
    type: string;
    autoComplete?: string;
    placeholder?: string;
    required?: boolean;
    fullWidth?: boolean;
    value: string;
  }
}
