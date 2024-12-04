import { v4 } from 'uuid';

export class SnapVoteAnswer {
  static copy(origin: SnapVoteAnswer) {
    return new SnapVoteAnswer(origin);
  }

  id: string = v4();
  voteResponseId: string = '';
  voteOptionId?: string;
  value?: string;

  constructor(props?: SnapVoteAnswer) {
    if (props) {
      this.id = props.id;
      this.voteResponseId = props.voteResponseId;
      if (props.voteOptionId) this.voteOptionId = props.voteOptionId;
      if (props.value) this.value = props.value;
    }
  }
}
