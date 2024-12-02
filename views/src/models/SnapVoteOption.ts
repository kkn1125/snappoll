import { v4 } from 'uuid';

export class SnapVoteOption {
  static copy(voteOption: SnapVoteOption) {
    return new SnapVoteOption(voteOption);
  }

  id: string = v4();
  voteId: string = '';
  content: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(props?: SnapVoteOption) {
    if (props) {
      this.id = props.id;
      this.voteId = props.voteId;
      this.content = props.content;
      this.createdAt = props.createdAt;
      this.updatedAt = props.updatedAt;
    }
  }

  setContent(content: string) {
    this.content = content;
  }
}
