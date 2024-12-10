export class SnapShareVote {
  static copy(snapShareVote: SnapShareVote) {
    return new SnapShareVote(snapShareVote);
  }

  id: string = '';
  voteId: string = '';
  url: string = '';
  createdAt: Date = new Date();
  deletedAt: Date | null = null;

  constructor(props: SnapShareVote) {
    if (props) {
      this.id = props.id;
      this.voteId = props.voteId;
      this.url = props.url;
      this.createdAt = props.createdAt;
      if (props.deletedAt) this.deletedAt = props.deletedAt;
    }
  }
}
