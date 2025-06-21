import { Icon } from '@iconify/react';
import { useNotificationContext } from '@/contexts/notification/notification-context';
import { Badge } from 'antd';

export const NotificationIcon: React.FC = () => {
  const { unreadCount } = useNotificationContext();

  return (
    <div className="relative inline-block mr-[10px]">
      <Badge count={unreadCount} size="small">
        <Icon icon="mdi:bell" width="16" height="16" />
      </Badge>
    </div>
  );
};
