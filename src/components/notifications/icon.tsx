import { useSubscription } from '@refinedev/core';
import { Badge } from 'antd';
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/utility/axios';
import { Bell } from 'lucide-react';

export const NotificationIcon: React.FC = () => {
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
    <div className="flex items-center justify-center mr-[10px]">
      <Badge count={unreadCount} size="small">
        <Bell strokeWidth={1.25} size={16} />
      </Badge>
    </div>
  );
};
