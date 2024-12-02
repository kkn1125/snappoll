import { v4 } from 'uuid';
import { SnapVoteOption } from './SnapVoteOption';

export class SnapVote {
  static copy(snapVote: SnapVote) {
    return new SnapVote(snapVote);
  }

  id: string = v4();
  userId: string = '';
  title: string = '';
  description: string = '';
  isMultiple: boolean = false;
  expiresAt?: Date;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  voteOption: SnapVoteOption[] = [];
  user?: User;

  constructor(props?: SnapVote) {
    if (props) {
      this.id = props.id;
      this.userId = props.userId;
      this.title = props.title;
      this.description = props.description;
      this.isMultiple = props.isMultiple;
      this.expiresAt = props.expiresAt;
      this.createdAt = props.createdAt;
      this.updatedAt = props.updatedAt;
      this.voteOption = [...props.voteOption];
    }
  }

  addOption(option: SnapVoteOption) {
    this.voteOption.push(option);
  }
}
