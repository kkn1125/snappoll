import { v4 } from 'uuid';
import { SnapPollOption } from './SnapPollOption';
import { SnapAnswer } from './SnapAnswer';

export class SnapPollQuestion {
  static copy(question: SnapPollQuestion) {
    return new SnapPollQuestion(question);
  }

  id: string = v4();
  pollId?: string = '';
  type: 'text' | 'checkbox' | 'select' = 'text';
  title: string = '';
  description?: string = '';
  order: number = -1;
  isMultiple: boolean = false;
  isRequired: boolean = false;
  useEtc: boolean = false;
  option: SnapPollOption[] = [];
  answer?: SnapAnswer[];

  constructor(props?: SnapPollQuestion) {
    if (props) {
      this.id = props.id;
      this.pollId = props.pollId;
      this.type = props.type;
      this.title = props.title;
      if (props.description) this.description = props.description;
      if (props.order) this.order = props.order;
      this.isMultiple = props.isMultiple || false;
      this.isRequired = props.isRequired || false;
      this.useEtc = props.useEtc;
      this.option = [...props.option];
    }
  }

  addOption(option: SnapPollOption) {
    this.option = [...this.option, option];
  }

  updateOptionByInfo(option: SnapPollOption) {
    this.option = this.option.map((opt) => {
      if (opt.id === option.id) {
        return option;
      }
      return opt;
    });
  }
}
