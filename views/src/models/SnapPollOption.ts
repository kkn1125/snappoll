import { isNil } from '@utils/isNil';
import { v4 } from 'uuid';

export class SnapPollOption implements Partial<Option> {
  static copy(option: SnapPollOption) {
    return new SnapPollOption(option);
  }
  id: string = v4();
  questionId: string = '';
  content: string = '';
  order: number = -1;

  constructor(props?: SnapPollOption) {
    if (props) {
      this.id = props.id;
      this.questionId = props.questionId;
      this.content = props.content;
      if (!isNil(props.order)) this.order = props.order;
    }
  }

  setContent(content: string) {
    this.content = content;
  }
}
