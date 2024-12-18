import { BASE_URL } from '@common/variables';
import { Logger } from '@utils/Logger';
import axios from 'axios';

const logger = new Logger('SnapApi');

export const snapApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 20 * 1000,
});

snapApi.interceptors.request.use((value) => {
  const params = value.params
    ? Object.entries(value.params)
        .map(([key, value]) => key + '=' + value)
        .join('&')
    : '';

  logger.debug(
    `[${value.method}] ${value.url}${params ? '?' + params : ''} --->`,
  );
  return value;
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
