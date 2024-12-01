import { v4 } from 'uuid';

export class SnapPollOption implements Partial<Option> {
  static copy(option: SnapPollOption) {
    return new SnapPollOption(option);
  }
  id: string = v4();
  questionId: string = '';
  content: string = '';

  constructor(props?: SnapPollOption) {
    if (props) {
      this.id = props.id;
      this.questionId = props.questionId;
      this.content = props.content;
    }
  }

  setContent(content: string) {
    this.content = content;
  }
}
