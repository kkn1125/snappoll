import { snapApi } from '.';

export const uploadProfileImage = async (file: File) => {
  const { data } = await snapApi.put(
    '/users/profile',
    { file },
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
};
