import { MODE } from '@common/variables';
import axios from 'axios';

export const snapApi = axios.create({
  baseURL:
    MODE === 'development'
      ? 'http://localhost:8080/api'
      : location.origin + '/api',
  withCredentials: true,
  timeout: 1000,
});
