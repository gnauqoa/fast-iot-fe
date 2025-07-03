import {
  HANDLE_JOINED_DEVICE_ROOM_CHANNEL,
  HANDLE_LEAVED_DEVICE_ROOM_CHANNEL,
  LIVE_PROVIDER_URL,
  TOKEN_KEY,
} from '@/constants';
import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

const initializeSocket = (): Socket => {
  if (!socketInstance) {
    const token = localStorage.getItem(TOKEN_KEY);
    socketInstance = io(LIVE_PROVIDER_URL, {
      auth: { token },
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketInstance.on(HANDLE_JOINED_DEVICE_ROOM_CHANNEL, (data: object) => {
      console.log('Joined room: ', data);
    });
    socketInstance.on(HANDLE_LEAVED_DEVICE_ROOM_CHANNEL, (data: object) => {
      console.log('Leaved room: ', data);
    });
  }
  return socketInstance;
};

export const connectSocket = () => {
  return null;
  const socket = initializeSocket();
  if (!socket.connected) {
    console.log('Connecting socket');
    socket.auth = { token: localStorage.getItem(TOKEN_KEY) };
    socket.connect();
  }
  return socket;
};

export const socket = initializeSocket();
