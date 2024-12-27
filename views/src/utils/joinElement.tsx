import { Divider } from '@mui/material';

export const joinElement = (
  array: any[],
  separator = <Divider flexItem orientation="vertical" />,
) => {
  const temp = [];
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    temp.push(item);
    if (i === array.length - 1) break;
    temp.push(separator);
  }
  return temp;
};
