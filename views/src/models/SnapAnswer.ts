import { v4 } from 'uuid';

export class SnapAnswer {
  static copy(origin: SnapAnswer) {
    return new SnapAnswer(origin);
  }

  id: string = v4();
  responseId: string = '';
  questionId: string = '';
  optionId?: string;
  value?: string;

  constructor(props?: SnapAnswer) {
    if (props) {
      this.id = props.id;
      this.responseId = props.responseId;
      this.questionId = props.questionId;
      if (props.optionId) this.optionId = props.optionId;
      if (props.value) this.value = props.value;
    }
  }
}
