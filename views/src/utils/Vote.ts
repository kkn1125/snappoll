import { v4 } from 'uuid';

export class VoteOptionItem {
  id: string;
  name: string;
  checked: boolean;
  value?: string;

  constructor(option: { name: string; checked: boolean; value?: string }) {
    this.id = v4();
    this.name = option.name;
    this.checked = option.checked;
    if (option.value) this.value = option.value;
  }
}
