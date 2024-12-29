import { snapApi } from '..';

export const addComment = async (data: SnapCommentAddDto) => {
  const { boardId, ...rest } = data;
  const { data: res } = await snapApi.post(`/comments/board/${boardId}`, rest);
  return res;
};
