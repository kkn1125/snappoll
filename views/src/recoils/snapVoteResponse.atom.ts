import { SnapVoteResponse } from '@models/SnapVoteResponse';
import { atom } from 'recoil';

export const snapVoteResponseAtom = atom<SnapVoteResponse[]>({
  key: 'snapVoteResponseAtom',
  default: [],
});
