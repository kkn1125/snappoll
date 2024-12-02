import { SnapVote } from '@models/SnapVote';
import { atom } from 'recoil';

export const snapVoteAtom = atom({
  key: 'snapVote',
  default: new SnapVote(),
});
