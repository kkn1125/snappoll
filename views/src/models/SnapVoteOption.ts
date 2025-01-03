import { v4 } from 'uuid';
import { SnapVoteAnswer } from './SnapVoteAnswer';
import { isNil } from '@utils/isNil';

export class SnapVoteOption {
  static copy(voteOption: SnapVoteOption) {
    return new SnapVoteOption(voteOption);
  }

  id: string = v4();
  voteId: string = '';
  content: string = '';
  order: number = -1;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  voteAnswer?: SnapVoteAnswer[];

  constructor(props?: SnapVoteOption) {
    if (props) {
      this.id = props.id;
      this.voteId = props.voteId;
      this.content = props.content;
      if (!isNil(props.order)) this.order = props.order;
      this.createdAt = props.createdAt;
      this.updatedAt = props.updatedAt;
    }
  }

  setContent(content: string) {
    this.content = content;
  }
}
