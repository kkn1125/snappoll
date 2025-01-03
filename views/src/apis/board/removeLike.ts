import { snapApi } from '..';

export const removeLike = async (boardId: string) => {
  const { data } = await snapApi.delete(`/boards/${boardId}/like`);
  return data;
};
