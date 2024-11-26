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
    options: Poll<PollType['type']>;
    user?: User;
  };
  interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    userProfile?: Profile[];
  }
  interface Profile {
    id: string;
    userId: string;
    image: {
      type: 'Buffer';
      data: number[];
    };
    createdAt: Date;
  }
  interface SignupUser extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    checkPassword: string;
  }
  interface LoginUser
    extends Omit<User, 'id' | 'username' | 'createdAt' | 'updatedAt'> {}
  type Message<T> = { [k in keyof T]: string };
  interface UserToken {
    token?: string;
    userId?: string;
    username?: string;
    profile?: {
      type: 'Buffer';
      data: number[];
    };
    signed: boolean;
    expired: boolean;
  }
}
