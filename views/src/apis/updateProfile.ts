import { snapApi } from '.';

export const updateProfile = async ({
  id,
  ...userData
}: Pick<User, 'id' | 'username'>) => {
  const { data } = await snapApi.put(`/users/${id}`, userData);
  return data;
};
