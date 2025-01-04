import { snapApi } from '..';

interface UpdatePlanProps {
  id: string;
  data: any;
}
export const updatePlan = async ({ id, data }: UpdatePlanProps) => {
  const { data: res } = await snapApi.patch(`/plans/${id}`, data);
  return res;
};
