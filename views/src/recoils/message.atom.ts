import { MessageManager } from '@models/MessageManager';
import { atom } from 'recoil';

export const messageAtom = atom({
  key: 'messages',
  default: new MessageManager(),
});
