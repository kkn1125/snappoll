import { snapApi } from '..';

export const removeComment = async (id: number) => {
  const { data } = await snapApi.delete(`/comments/${id}`);
  return data;
};
