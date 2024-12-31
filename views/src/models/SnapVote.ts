import { v4 } from 'uuid';
import { SnapVoteOption } from './SnapVoteOption';
import { SnapVoteResponse } from './SnapVoteResponse';
import { SnapShareVote } from './SnapShareVote';

export class SnapVote {
  static copy(snapVote: SnapVote) {
    return new SnapVote(snapVote);
  }

  id: string = v4();
  userId: string = '';
  title: string = '';
  description: string = '';
  isMultiple: boolean = false;
  useEtc: boolean = false;
  expiresAt: Date | null = null;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  user?: User;
  voteResponse: SnapVoteResponse[] = [];
  voteOption: SnapVoteOption[] = [];
  shareVote?: SnapShareVote;

  constructor(props?: SnapVote) {
    if (props) {
      this.id = props.id;
      this.userId = props.userId;
      this.title = props.title;
      this.description = props.description;
      this.isMultiple = props.isMultiple;
      this.useEtc = props.useEtc;
      this.expiresAt = props.expiresAt;
      this.createdAt = props.createdAt;
      this.updatedAt = props.updatedAt;
      this.voteOption = [...props.voteOption];
      if (props.shareVote) this.shareVote = props.shareVote;
    }
  }

  addOption(option: SnapVoteOption) {
    this.voteOption.push(option);
  }

  deleteOption(id: string) {
    this.voteOption = this.voteOption.filter(
      (voteOption) => voteOption.id !== id,
    );
  }
}
