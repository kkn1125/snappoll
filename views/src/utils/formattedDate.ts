import { DATE_FORMAT } from '@common/variables';
import dayjs from 'dayjs';

export const formattedDate = (date?: Date | string | null) =>
  dayjs(date).format(DATE_FORMAT);
