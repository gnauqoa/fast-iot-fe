import React, { useEffect } from 'react';
import { Card, List, Spin, Alert, Tag, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { IStatus } from '@/interfaces/user';
import { stringToHexColor } from '@/utility/color';
import { useStatusData } from '@/hooks/use-status-data';

export const StatusDemo: React.FC = () => {
  const { statuses, loading, error, refreshStatuses, clearStatusError } = useStatusData();

  // Handle errors by showing them and clearing after user acknowledgment
  useEffect(() => {
    if (error) {
      // Error is displayed in the Alert component below
      console.error('Status data error:', error);
    }
  }, [error]);

  if (loading && !statuses.length) {
    return (
      <Card
        title="Status Data (via Redux)"
        extra={
          <Button icon={<ReloadOutlined />} onClick={refreshStatuses} loading={loading}>
            Refresh
          </Button>
        }
      >
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '16px' }}>Loading statuses...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        title="Status Data (via Redux)"
        extra={
          <Button icon={<ReloadOutlined />} onClick={refreshStatuses}>
            Retry
          </Button>
        }
      >
        <Alert
          message="Error Loading Status Data"
          description={error}
          type="error"
          showIcon
          action={
            <Button
              size="small"
              danger
              onClick={() => {
                clearStatusError();
                refreshStatuses();
              }}
            >
              Retry
            </Button>
          }
          onClose={clearStatusError}
          closable
        />
      </Card>
    );
  }

  return (
    <Card
      title="Status Data (via Redux)"
      style={{ margin: '16px 0' }}
      extra={
        <Button icon={<ReloadOutlined />} onClick={refreshStatuses} loading={loading} size="small">
          Refresh
        </Button>
      }
    >
      <p style={{ marginBottom: 16, color: '#666', fontSize: '13px' }}>
        🔄 This component demonstrates reading status data using Redux store (read-only). The main
        CRUD operations are handled by Refine in the <strong>/statuses</strong> page.
      </p>

      <List<IStatus>
        dataSource={statuses}
        renderItem={(status: IStatus) => (
          <List.Item style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ minWidth: '25px' }}>#{status.id}</strong>
              <Tag color={stringToHexColor(status.name)} style={{ fontWeight: 'bold', margin: 0 }}>
                {status.name}
              </Tag>
              <Tag
                color={stringToHexColor(status.__entity)}
                style={{ fontSize: '10px', margin: 0 }}
              >
                {status.__entity}
              </Tag>
            </div>
          </List.Item>
        )}
        locale={{
          emptyText: (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              <p>No statuses found.</p>
              <p style={{ fontSize: '12px' }}>
                Create some statuses in the <strong>/statuses</strong> page.
              </p>
            </div>
          ),
        }}
      />

      <div
        style={{
          marginTop: 16,
          fontSize: '12px',
          color: '#999',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>
          Total statuses: <strong>{statuses?.length || 0}</strong>
        </span>
        <span>🎨 Colors generated using stringToHexColor</span>
      </div>
    </Card>
  );
};
