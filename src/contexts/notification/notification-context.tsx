import { createContext, useContext, useEffect, useState } from 'react';
import { useSubscription } from '@refinedev/core';
import { axiosInstance } from '@/utility/axios';

type NotificationContextType = {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  refetchUnreadCount: () => void;
};

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  setUnreadCount: () => {},
  refetchUnreadCount: () => {},
});

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await axiosInstance.get('/notifications/unread');
      setUnreadCount(res.data.count || 0);
    } catch (err) {
      console.error('Fetch unread count failed', err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useSubscription({
    channel: 'notification:created',
    onLiveEvent: () => {
      fetchUnreadCount();
    },
  });

  useSubscription({
    channel: 'notification:updated',
    onLiveEvent: () => {
      fetchUnreadCount();
    },
  });

  useSubscription({
    channel: 'notification:deleted',
    onLiveEvent: () => {
      fetchUnreadCount();
    },
  });

  return (
    <NotificationContext.Provider
      value={{ unreadCount, setUnreadCount, refetchUnreadCount: fetchUnreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
