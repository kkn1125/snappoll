import { snapApi } from '..';

export const cancelSubscription = async (subscriptionId: string) => {
  const { data } = await snapApi.post('/plans/subscribe/cancel', {
    subscriptionId,
  });
  return data;
};
