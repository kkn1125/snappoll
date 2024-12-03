import { MODE } from '@common/variables';
import { io } from 'socket.io-client';

export const socket = io(
  MODE === 'development' ? 'http://localhost:8080' : location.origin,
  {
    autoConnect: false,
    secure: true,
    withCredentials: true,
  },
);
