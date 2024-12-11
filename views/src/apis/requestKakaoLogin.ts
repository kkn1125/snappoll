import { BASE_URL } from '@common/variables';

export const requestKakaoLogin = async () => {
  // const { data } = await snapApi.get('/auth/request/kakao', {
  //   withCredentials: true,
  // });
  const form = document.createElement('form');
  form.action = BASE_URL + '/auth/request/kakao';
  form.hidden = true;
  document.body.append(form);
  form.requestSubmit();
  // return data;
};
