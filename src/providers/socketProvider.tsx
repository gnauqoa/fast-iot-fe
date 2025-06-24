import React, { createContext, useContext } from 'react';
import { socket as defaultSocket, connectSocket } from '@/utility/socket';

interface SocketContextType {
  socket: typeof defaultSocket;
  connectSocket: typeof connectSocket;
}

const SocketContext = createContext<SocketContextType>({
  socket: defaultSocket,
  connectSocket,
});

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket: defaultSocket, connectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
