import axios from 'axios';

export const snapApi = axios.create({
  baseURL: 'http://localhost:8080/api',
});
