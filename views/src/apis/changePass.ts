import { snapApi } from '.';

export const changePass = async ({
  id,
  password,
  currentPassword,
}: {
  id: string;
  password: string;
  currentPassword: string;
}) => {
  const { data } = await snapApi.put(`/users/${id}/password`, {
    currentPassword,
    password,
  });
  return data;
};
