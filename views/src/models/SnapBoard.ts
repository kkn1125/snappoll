export class SnapBoard {
  id!: string;
  userId!: string;
  order!: number;
  category!: 'notice' | 'community' | 'event' | 'faq';
  password!: string;
  title!: string;
  content!: string;
  viewCount!: number;
  likeCount!: number;
  isPrivate!: boolean;
  isOnlyCrew!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;

  author?: User;
}
