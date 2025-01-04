import { snapApi } from '..';

export const deletePlan = async (id: string) => {
  const { data } = await snapApi.delete(`/plans/${id}`);
  return data;
};
