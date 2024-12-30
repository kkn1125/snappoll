import { snapApi } from '..';

interface EditCommentProps {
  id: number;
  data: SnapCommentAddDto;
}
export const editComment = async ({ id, data: res }: EditCommentProps) => {
  const { data } = await snapApi.patch(`/comments/${id}`, res);
  return data;
};
