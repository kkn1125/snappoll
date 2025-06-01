export class SnapBoard {
  id!: string;
  userId!: string;
  order!: number;
  category!: 'notice' | 'community' | 'event' | 'faq';
  password!: string;
  title!: string;
  content!: string;
  // likeCount!: number;
  viewCount!: number;
  isPrivate!: boolean;
  isNotice!: boolean;
  isOnlyCrew!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;

  author?: User;

  liked!: boolean;

  _count?: {
    boardLike?: number;
  };
}
