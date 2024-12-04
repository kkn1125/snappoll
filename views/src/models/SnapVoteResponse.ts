import { v4 } from 'uuid';
import { SnapVote } from './SnapVote';
import { SnapVoteAnswer } from './SnapVoteAnswer';

export class SnapVoteResponse {
  static copy(snapVoteResponse: SnapVoteResponse) {
    return new SnapVoteResponse(snapVoteResponse);
  }

  id: string = v4();
  userId?: string;
  voteId: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  vote?: SnapVote;
  user?: User;
  voteAnswer: SnapVoteAnswer[] = [];

  constructor(props?: SnapVoteResponse) {
    if (props) {
      this.id = props.id;
      if (props.userId) this.userId = props.userId;
      this.voteId = props.voteId;
      this.createdAt = props.createdAt;
      this.updatedAt = props.updatedAt;
      if (props.vote) this.vote = props.vote;
      if (props.user) this.user = props.user;
      this.voteAnswer = [...props.voteAnswer];
    }
  }

  updateAnswer(id: string, value?: string) {
    this.voteAnswer = this.voteAnswer.map((answer) => {
      if (answer.id === id && !answer.voteOptionId) {
        const copyAnswer = SnapVoteAnswer.copy(answer);
        copyAnswer.voteOptionId = undefined;
        copyAnswer.value = value;
        return copyAnswer;
      }
      return answer;
    });
  }

  removeAnswer(optionId: string) {
    this.voteAnswer = this.voteAnswer.filter(
      (answer) => answer.voteOptionId !== optionId,
    );
  }

  hasAnswer(id: string) {
    const answer = this.voteAnswer.find((answer) => answer.id === id);
    return answer;
  }

  hasTextAnswer(id: string) {
    const answer = this.voteAnswer.find(
      (answer) => answer.id === id && !answer.voteOptionId,
    );
    return answer;
  }

  hasOption(optionId: string) {
    const option = this.voteAnswer.find(
      (answer) => answer.voteOptionId === optionId,
    );
    return option;
  }

  addAnswer(answer: SnapVoteAnswer) {
    this.voteAnswer.push(answer);
  }
}
