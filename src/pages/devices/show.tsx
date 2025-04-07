import { Link, useShow } from '@refinedev/core';
import { Show } from '@refinedev/antd';
import { Badge, Button, Flex, message, Typography } from 'antd';
import { DeviceStatus, IDevice } from '@/interfaces/device';
import { useEffect, useState } from 'react';
import { socket } from '@/providers/liveProvider';
import { capitalize } from '@/utility/text';
import {
  HANDLE_DEVICE_DATA_CHANNEL,
  JOIN_DEVICE_ROOM_CHANNEL,
  LEAVE_DEVICE_ROOM_CHANNEL,
} from '@/constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { axiosInstance } from '@refinedev/nestjsx-crud';

dayjs.extend(relativeTime);
const { Title } = Typography;

export const DeviceShow = () => {
  const { query: queryResult } = useShow<IDevice>({});
  const { data, isLoading } = queryResult;
  const record = data?.data;
  const [device, setDevice] = useState<IDevice | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);

  const fetchDeviceToken = async () => {
    if (!device) return;
    try {
      const response = await axiosInstance.get(`/devices/${device.id}/password`);
      setDeviceToken(`${response.data.deviceKey}-${response.data.deviceToken}`);
      message.success('Device token created!');
    } catch (error) {
      message.error('Failed to create device token.');
    }
  };

  const handleDeviceUpdate = (updatedDevice: IDevice) => {
    setDevice(updatedDevice);
  };

  useEffect(() => {
    if (!record) return;

    setDevice(record);

    socket.emit(JOIN_DEVICE_ROOM_CHANNEL, record.id);
    socket.on(HANDLE_DEVICE_DATA_CHANNEL, handleDeviceUpdate);

    return () => {
      socket.emit(LEAVE_DEVICE_ROOM_CHANNEL, record.id);
      socket.off(HANDLE_DEVICE_DATA_CHANNEL, handleDeviceUpdate);
    };
  }, [record]);

  if (!device) {
    return <></>;
  }

  return (
    <Show isLoading={isLoading}>
      <Flex vertical gap={12}>
        <Flex gap={12} align="center">
          <Title level={3} style={{ marginBottom: 0 }}>
            {device.name}
          </Title>
          <Badge
            status={device.status === DeviceStatus.Online ? 'success' : 'error'}
            text={capitalize(device.status)}
          />
          {device.lastUpdate ? (
            <>
              <Title level={5} style={{ marginBottom: 0 }}>
                -
              </Title>
              <Title level={5} style={{ margin: 0 }}>
                {dayjs(device.lastUpdate).from(dayjs())}
              </Title>
            </>
          ) : (
            <></>
          )}
        </Flex>

        <Flex vertical>
          <Flex gap={8} align="center">
            <Title level={5} style={{ marginBottom: 0 }}>
              Device token:
            </Title>
            {deviceToken ? (
              <Typography.Text code copyable>
                {deviceToken}
              </Typography.Text>
            ) : (
              <>
                <Typography.Text type="secondary">Click to reveal</Typography.Text>
                <Button
                  icon={deviceToken ? <ReloadOutlined /> : <EyeOutlined />}
                  onClick={fetchDeviceToken}
                />
              </>
            )}
          </Flex>
        </Flex>

        <Flex>
          <Link to={`/users/${device.userId}`}>
            <Title level={5}>{device.user.fullName}</Title>
          </Link>
        </Flex>
      </Flex>
    </Show>
  );
};
