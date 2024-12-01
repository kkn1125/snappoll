import { v4 } from 'uuid';
import { SnapAnswer } from './SnapAnswer';

export class SnapResponse {
  static copy(origin: SnapResponse) {
    return new SnapResponse(origin);
  }

  id: string = v4();
  userId?: string;
  pollId: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  answer: SnapAnswer[] = [];

  constructor(props?: SnapResponse) {
    if (props) {
      this.id = props.id;
      if (props.userId) this.userId = props.userId;
      this.pollId = props.pollId;
      this.createdAt = props.createdAt;
      this.updatedAt = props.updatedAt;
      this.answer = [...props.answer];
    }
  }

  updateAnswer(id: string, value?: string) {
    this.answer = this.answer.map((answer) => {
      if (answer.id === id && !answer.optionId) {
        const copyAnswer = SnapAnswer.copy(answer);
        copyAnswer.optionId = undefined;
        copyAnswer.value = value;
        return copyAnswer;
      }
      return answer;
    });
  }

  removeOption(optionId: string) {
    this.answer = this.answer.filter((answer) => answer.optionId !== optionId);
  }

  hasQuestion(id: string) {
    const answer = this.answer.find((answer) => answer.id === id);
    return answer;
  }

  hasTextQuestion(id: string) {
    const answer = this.answer.find(
      (answer) => answer.id === id && !answer.optionId,
    );
    return answer;
  }

  hasOption(optionId: string) {
    const option = this.answer.find((answer) => answer.optionId === optionId);
    return option;
  }

  addAnswer(answer: SnapAnswer) {
    this.answer.push(answer);
  }
}
