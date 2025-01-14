import { snapApi } from '..';

export const cancelSubscription = async (subscriptionId: string) => {
  const { data } = await snapApi.post('/plans/subscription/cancel', {
    subscriptionId,
  });
  return data;
};
