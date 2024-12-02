import { v4 } from 'uuid';

export class SnapVoteResponse {
  static copy(snapVoteResponse: SnapVoteResponse) {
    return new SnapVoteResponse(snapVoteResponse);
  }

  id: string = v4();
  userId?: string;
  voteId: string = '';
  voteOptionId: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(props?: SnapVoteResponse) {
    if (props) {
      this.id = props.id;
      if (props.userId) this.userId = props.userId;
      this.voteId = props.voteId;
      this.voteOptionId = props.voteOptionId;
      this.createdAt = props.createdAt;
      this.updatedAt = props.updatedAt;
    }
  }
}
