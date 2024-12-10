import { BASE_URL } from '@common/variables';
import axios from 'axios';

export const snapApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 1000,
});
