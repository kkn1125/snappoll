import { DATE_FORMAT } from '@common/variables';
import dayjs from 'dayjs';

export const formattedDate = (
  date?: Date | string | null,
  customFormat?: string,
) => dayjs(date).format(customFormat || DATE_FORMAT);
