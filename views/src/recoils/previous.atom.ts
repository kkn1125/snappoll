import { atom } from 'recoil';

export const previousAtom = atom<string | undefined>({
  key: 'previous',
  default: undefined,
});
