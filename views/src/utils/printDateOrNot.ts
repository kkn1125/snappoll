import { formattedDate } from './formattedDate';

export const printDateOrNot = (date?: Date | null) =>
  date ? formattedDate(date) + '까지' : '마감기한이 없습니다.';
