import { useRef, useEffect } from 'react';
import { List, Typography, Card, theme, Tag, Space } from 'antd';
import { IDevice, DeviceStatus, statusColors } from '@/interfaces/device';
import { capitalize } from '@/utility/text';

const { Text } = Typography;

interface DeviceMapsProps {
  devices: IDevice[];
  selectedDeviceId: number | null;
  onDeviceHover: (deviceId: number | null) => void;
  onDeviceClick: (device: IDevice) => void;
  deviceItemRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
}

export const DeviceMaps: React.FC<DeviceMapsProps> = ({
  devices,
  selectedDeviceId,
  onDeviceHover,
  onDeviceClick,
  deviceItemRefs,
}) => {
  const deviceListRef = useRef<HTMLDivElement>(null);
  const { token } = theme.useToken();

  // Effect to scroll to selected device in the list
  useEffect(() => {
    if (selectedDeviceId !== null && deviceListRef.current) {
      const deviceItem = deviceItemRefs.current[selectedDeviceId];
      if (deviceItem) {
        deviceItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedDeviceId, deviceItemRefs]);

  // Calculate status statistics for display
  const onlineDevices = devices.filter(d => d.status === DeviceStatus.Online).length;
  const offlineDevices = devices.filter(d => d.status === DeviceStatus.Offline).length;

  return (
    <div ref={deviceListRef} style={{ height: '100%', overflow: 'auto', padding: '16px' }}>
      <div style={{ marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Found Devices ({devices.length})
        </Typography.Title>
        <Space style={{ marginTop: 8 }}>
          <Tag color={statusColors[DeviceStatus.Online]} style={{ margin: 0 }}>
            Online: {onlineDevices}
          </Tag>
          <Tag color={statusColors[DeviceStatus.Offline]} style={{ margin: 0 }}>
            Offline: {offlineDevices}
          </Tag>
        </Space>
      </div>

      <List
        dataSource={devices}
        renderItem={device => (
          <List.Item
            ref={el => (deviceItemRefs.current[device.id] = el)}
            onMouseEnter={() => onDeviceHover(device.id)}
            onMouseLeave={() => onDeviceHover(null)}
            onClick={() => onDeviceClick(device)}
            style={{
              cursor: 'pointer',
              backgroundColor:
                selectedDeviceId === device.id ? token.colorPrimaryBg : 'transparent',
              padding: '8px',
              borderRadius: '4px',
              transition: 'background-color 0.3s',
              border:
                selectedDeviceId === device.id
                  ? `2px solid ${token.colorPrimary}`
                  : '2px solid transparent',
            }}
          >
            <Card size="small" style={{ width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Text strong>{device.name}</Text>

                <Tag color={statusColors[device.status]} style={{ margin: 0, fontSize: '12px' }}>
                  {capitalize(device.status)}
                </Tag>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  User: {device.user?.fullName || 'Unknown'}
                </Text>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Updated: {new Date(device.lastUpdate).toLocaleString()}
                </Text>
              </div>
            </Card>
          </List.Item>
        )}
        locale={{ emptyText: 'No devices found in this area' }}
      />
    </div>
  );
};
