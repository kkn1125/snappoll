import { snapApi } from '..';

export const addLike = async (boardId: string) => {
  const { data } = await snapApi.post(`/boards/${boardId}/like`);
  return data;
};
