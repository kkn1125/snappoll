export class SnapSharePoll {
  static copy(snapSharePoll: SnapSharePoll) {
    return new SnapSharePoll(snapSharePoll);
  }

  id: string = '';
  pollId: string = '';
  url: string = '';
  createdAt: Date = new Date();
  deletedAt: Date | null = null;
  
  constructor(props: SnapSharePoll) {
    if (props) {
      this.id = props.id;
      this.pollId = props.pollId;
      this.url = props.url;
      this.createdAt = props.createdAt;
      if (props.deletedAt) this.deletedAt = props.deletedAt;
    }
  }
}
