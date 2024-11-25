import { atom } from 'recoil';

export const tokenAtom = atom<UserToken>({
  key: 'token',
  default: {
    token: undefined,
    signed: false,
    expired: true,
  },
});
