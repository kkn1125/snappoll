import { SnapPoll } from '@models/SnapPoll';
import { atom } from 'recoil';

export const snapPollAtom = atom<SnapPoll>({
  key: 'snapPoll',
  default: new SnapPoll(),
});
