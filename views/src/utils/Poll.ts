import { v4 } from 'uuid';

export class Poll<T extends PollType['type']> implements BasePoll {
  id: string = v4();

  /* common */
  name: string = '';
  desc?: string = '';
  label: string = '';
  required?: boolean = false;

  /* semi common */
  type: T = 'text' as T;
  default?: InferPollDefault<T>;

  /* text */
  placeholder: string = '';

  /* text, option */
  value: string = '';

  /* option, checkbox */
  items!: {
    name: string;
    value: string;
    checked: boolean;
  }[];

  constructor(poll?: Poll<T>) {
    if (poll) {
      this.name = poll!.name || '';
      this.desc = poll!.desc || '';
      this.label = poll!.label || '';
      this.required = poll!.required || false;

      this.type = poll!.type || 'text';
      this.default = poll!.default || undefined;

      if (poll!.type === 'text') {
        this.value = poll!.value || '';
        this.placeholder = poll!.placeholder || '';
        this.items = poll!.items || [
          {
            name: '',
            value: '',
            checked: false,
          },
        ];
      }

      if (poll!.type === 'option') {
        this.value = poll!.value || '';
        this.items = poll!.items || [
          {
            name: '',
            value: '',
            checked: false,
          },
        ];
      }

      if (poll!.type === 'checkbox') {
        this.items = poll!.items || [
          {
            name: '',
            value: '',
            checked: false,
          },
        ];
      }
    }
    if (!poll || poll!.type === 'text') {
      this.items = [
        {
          name: '',
          value: '',
          checked: false,
        },
      ];
    }
  }
}

// export class TextPoll extends Poll<TextPollType> {
//   /* text */
//   placeholder?: string;

//   /* text, option */
//   value!: InferPollValue<TextPollType>;

//   constructor(poll: Poll<TextPollType>) {
//     super(poll);
//   }
// }

// export class OptionPoll extends Poll<OptionPollType> {
//   /* text, option */
//   value!: InferPollValue<OptionPollType>;

//   /* option, checkbox */
//   items!: InferPollItems<T>[];

//   constructor(poll: Poll<OptionPollType>) {
//     super(poll);
//   }
// }

// export class OptionPoll extends Poll<OptionPollType> {
//   /* text, option */
//   value!: InferPollValue<OptionPollType>;

//   /* option, checkbox */
//   items!: InferPollItems<T>[];

//   constructor(poll: Poll<OptionPollType>) {
//     super(poll);
//   }
// }
