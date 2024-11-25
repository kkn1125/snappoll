import { atom } from 'recoil';

export const tokenAtom = atom<UserToken>({
  key: 'token',
  default: {
    token: undefined,
    userId: undefined,
    signed: false,
    expired: true,
  },
});
