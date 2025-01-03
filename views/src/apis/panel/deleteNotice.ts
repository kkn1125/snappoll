import { snapApi } from '..';

export const deleteNoticeForce = async (id: string) => {
  const { data } = await snapApi.delete(`/notices/${id}`);
  return data;
};
