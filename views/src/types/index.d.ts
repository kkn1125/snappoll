import '@mui/material/styles';
import '@mui/material/Button';
import '@mui/material/AppBar';

export declare module '@mui/material/styles' {
  export declare interface Palette {
    sky: Palette['primary'];
  }
  export declare interface PaletteOptions {
    sky?: PaletteOptions['primary'];
  }
}

export declare module '@mui/material/Button' {
  export interface ButtonPropsColorOverrides {
    sky: true;
  }
}

export declare module '@mui/material/AppBar' {
  export interface AppBarPropsColorOverrides {
    sky: true;
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

  export type InferPollType<T> = T extends infer U
    ? U extends 'text'
      ? string
      : U extends 'option'
        ? string
        : U extends 'checkbox'
          ? boolean
          : never
    : never;

  export type InferPollDefault<T> = T extends infer D
    ? D extends 'text'
      ? string
      : D extends 'option'
        ? string
        : D extends 'checkbox'
          ? boolean
          : never
    : never;

  // export type InferPollItems<T> = T extends infer I
  //   ? I extends 'text'
  //     ? {
  //         name: string;
  //         value: string;
  //         checked: boolean;
  //       }
  //     : I extends 'option'
  //       ? {
  //           name: string;
  //           value: string;
  //           checked?: boolean;
  //         }
  //       : I extends 'checkbox'
  //         ? {
  //             name: string;
  //             value?: string;
  //             checked: boolean;
  //           }
  //         : {
  //             name: string;
  //             value: string;
  //             checked: boolean;
  //           }
  //   : never;

  export type InferPollValue<T> = T extends infer V
    ? V extends 'text'
      ? string
      : V extends 'option'
        ? string
        : never
    : never;

  interface BasePoll {
    name: string;
    desc?: string;
    label: string;
    required?: boolean;
  }
  interface TextPoll extends BasePoll {
    type: 'text';
    default?: string;
    value?: string;
    placeholder?: string;
    items?: never[];
  }
  interface OptionPoll extends BasePoll {
    type: 'option';
    default: string;
    value?: string;
    items: { name: string; value: string }[];
  }
  interface CheckboxPoll extends BasePoll {
    type: 'checkbox';
    default: boolean;
    items: { name: string; checked?: boolean }[];
  }
  type PollTypes<T> = T extends infer R extends 'text'
    ? TextPoll
    : infer R extends 'option'
      ? OptionPoll
      : infer R extends 'checkbox'
        ? CheckboxPoll
        : TextPoll;

  type APIPoll = {
    id: string;
    title: string;
    description: string;
    expiresAt: Date;
    // options: Poll<PollType['type']>;
    user?: User;
  };
  interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    poll?: UserPoll[];
    userProfile?: Profile;
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
  interface Profile {
    id: string;
    userId: string;
    image: object;
    createdAt: Date;
  }
  interface SignupUser extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    checkPassword: string;
  }
  interface LoginUser
    extends Omit<User, 'id' | 'username' | 'createdAt' | 'updatedAt'> {}
  type ErrorMessage<T = object> = Partial<{ [k in keyof T]: string }>;
  interface UserToken {
    // token?: string;
    user?: Pick<User, 'id' | 'email' | 'username' | 'userProfile'>;
    // signed: boolean;
    // expired: boolean;
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

  // interface VoteOption {
  //   type: string;
  //   items: VoteOptionItem[];
  // }

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
    content: string | string[];
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
}
