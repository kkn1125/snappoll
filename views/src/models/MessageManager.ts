export class Message {
  id: string = '';
  fromId: string = '';
  toId: string = '';
  message: string = '';
  checked: boolean = false;
  createdAt: Date = new Date();
  constructor(props?: Message) {
    if (props) {
      this.id = props.id;
      this.fromId = props.fromId;
      this.toId = props.toId;
      this.message = props.message;
      this.checked = props.checked;
      this.createdAt = props.createdAt;
    }
  }
}

export class MessageManager {
  static copy(messageManager: MessageManager) {
    return new MessageManager(messageManager);
  }

  sender: Message[] = [];
  receiver: Message[] = [];

  constructor(props?: MessageManager) {
    if (props) {
      this.sender = [...props.sender];
      this.receiver = [...props.receiver];
    }
  }

  get hasNewMessage() {
    return this.receiver.every((message) => message.checked);
  }

  get notReadMessages() {
    return this.receiver.filter((message) => !message.checked);
  }

  getOthersMessages() {
    return this.receiver;
  }

  getSended() {
    return this.sender;
  }
}
