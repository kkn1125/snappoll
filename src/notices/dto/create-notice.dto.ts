import { $Enums, Notice } from '@prisma/client';

export class CreateNoticeDto
  implements Omit<Notice, 'id' | 'createdAt' | 'updatedAt'>
{
  type: $Enums.NoticeType;
  cover: string | null;
  title: string;
  content: string;
}
