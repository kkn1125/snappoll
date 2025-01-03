import { snapApi } from '..';

export const createNotice = async (
  data: Omit<SnapNotice, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  const { data: result } = await snapApi.post('/notices', data);
  return result;
};
