import { BASE_URL } from '@common/variables';
import { Logger } from '@utils/Logger';
import axios from 'axios';

const logger = new Logger('SnapApi');

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
    logger.error(error);
    return Promise.reject(error);
  },
);
