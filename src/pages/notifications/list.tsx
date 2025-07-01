import { Table, Tag, Button, Form, Space, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { DeleteButton, useTable } from '@refinedev/antd';
import { INotification } from '@/interfaces/notification';
import dayjs from 'dayjs';
import { useCustomMutation, useSubscription } from '@refinedev/core';

const { Text } = Typography;

export const NotificationList = () => {
  const { tableProps, tableQuery } = useTable<INotification>({
    resource: 'notifications',
    syncWithLocation: true,
    pagination: { pageSize: 10 },
  });

  const { mutate: markAsRead } = useCustomMutation();
  const { mutate: markAllAsRead, isLoading: markingAll } = useCustomMutation();

  useSubscription({
    channel: 'notification:created',
    onLiveEvent: () => {
      tableQuery.refetch();
    },
  });

  useSubscription({
    channel: 'notification:updated',
    onLiveEvent: () => {
      tableQuery.refetch();
    },
  });

  useSubscription({
    channel: 'notification:deleted',
    onLiveEvent: () => {
      tableQuery.refetch();
    },
  });

  const handleMarkAsRead = (id: number) => {
    markAsRead({
      method: 'patch',
      url: `/notifications/${id}/read`,
      values: {},
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead({
      method: 'patch',
      url: `/notifications/read`,
      values: {},
      successNotification: () => ({
        message: 'All notifications marked as read',
        type: 'success',
      }),
    });
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={handleMarkAllAsRead}
          loading={markingAll}
          disabled={tableProps.dataSource?.every(item => item.isRead)}
        >
          Mark all as read
        </Button>
      </Space>

      <Table {...tableProps} rowKey="id" style={{ marginTop: 16 }}>
        <Table.Column
          dataIndex="title"
          title="Title"
          render={(value: string, record: INotification) => (
            <div
              className="relative max-w-[200px] cursor-pointer"
              onClick={() => {
                if (!record.isRead) {
                  handleMarkAsRead(record.id);
                }
              }}
              key={record.id}
            >
              {!record.isRead && (
                <span className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full z-10" />
              )}
              <Text ellipsis={{ tooltip: true }}>{value}</Text>
            </div>
          )}
        />

        <Table.Column
          dataIndex="body"
          title="Body"
          render={(value: string) => (
            <Text ellipsis={{ tooltip: true }} style={{ maxWidth: 300 }}>
              {value}
            </Text>
          )}
        />
        <Table.Column
          dataIndex="isRead"
          title="Status"
          render={(value: boolean) => (
            <Tag color={value ? 'green' : 'blue'}>{value ? 'Read' : 'Unread'}</Tag>
          )}
        />
        <Table.Column dataIndex="userId" title="User ID" render={(v: number) => v || '-'} />
        <Table.Column
          dataIndex="createdAt"
          title="Created At"
          render={(value: Date) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-')}
          sorter
        />
        <Table.Column
          title="Actions"
          render={(_, record: INotification) => (
            <DeleteButton hideText size="small" recordItemId={record.id} />
          )}
        />
      </Table>
    </div>
  );
};
