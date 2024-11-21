import { atom } from 'recoil';

export const sidebarAtom = atom({
  key: 'sidebar',
  default: {
    opened: true,
  },
});
