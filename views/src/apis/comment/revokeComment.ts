import { snapApi } from '..';

export const revokeComment = async (id: number) => {
  const { data } = await snapApi.put(`/comments/revoke/${id}`);
  return data;
};
