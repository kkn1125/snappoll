import { snapApi } from '..';

export const removeLike = async (boardId: string) => {
  const { data } = await snapApi.post(`/boards/${boardId}/like`, {
    action: 'dislike',
  });
  return data;
};
