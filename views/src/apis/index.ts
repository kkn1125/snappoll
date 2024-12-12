import { BASE_URL } from '@common/variables';
import axios from 'axios';

export const snapApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 5000,
});

snapApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);

    return Promise.reject(error);
  },
);
