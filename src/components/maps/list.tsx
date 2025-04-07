import { useRef, useEffect } from 'react';
import { List, Typography, Card, theme } from 'antd';
import { IDevice } from '@/interfaces/device';

const { Text } = Typography;

interface DeviceListProps {
  devices: IDevice[];
  selectedDeviceId: number | null;
  onDeviceHover: (deviceId: number | null) => void;
  onDeviceClick: (device: IDevice) => void;
  deviceItemRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
}

export const DeviceList: React.FC<DeviceListProps> = ({
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

  return (
    <div ref={deviceListRef} style={{ height: '100%', overflow: 'auto', padding: '16px' }}>
      <Typography.Title level={4}>Scanned Devices ({devices.length})</Typography.Title>
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
            }}
          >
            <Card size="small" style={{ width: '100%' }}>
              <Text strong>{device.name}</Text>
              <div>
                <Text type="secondary">Status: {device.status}</Text>
              </div>
              <div>
                <Text type="secondary">
                  Last Update: {new Date(device.lastUpdate).toLocaleString()}
                </Text>
              </div>
            </Card>
          </List.Item>
        )}
        locale={{ emptyText: 'No devices found' }}
      />
    </div>
  );
};
