import { snapApi } from '..';

export const getComments = async (page: number, boardId?: string) => {
  if (!boardId) return {};
  const { data } = await snapApi.get(`/comments/board/${boardId}`, {
    params: { page },
  });
  return data;
};
