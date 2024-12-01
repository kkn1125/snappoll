import { SnapResponse } from '@models/SnapResponse';
import { atom } from 'recoil';

export const snapResponseAtom = atom({
  key: 'snapResponse',
  default: new SnapResponse(),
});
