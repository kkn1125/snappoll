export class SnapBoard {
  id!: string;
  userId!: string;
  order!: number;
  category!: string;
  title!: string;
  content!: string;
  viewCount!: number;
  isPrivate!: boolean;
  isOnlyCrew!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;

  author?: User;
}
