import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useShow } from '@refinedev/core';
import { Show } from '@refinedev/antd';
import { Badge, Button, Flex, message, Typography } from 'antd';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Background, ColorMode, Controls, ReactFlow } from '@xyflow/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { DeviceStatus, IChannel, IDevice } from '@/interfaces/device';
import { socket } from '@/providers/liveProvider';
import { capitalize } from '@/utility/text';
import { nodeTypes } from '@/utility/node';
import {
  HANDLE_DEVICE_DATA_CHANNEL,
  JOIN_DEVICE_ROOM_CHANNEL,
  LEAVE_DEVICE_ROOM_CHANNEL,
} from '@/constants';
import { axiosInstance } from '@refinedev/nestjsx-crud';
import useReactFlow, { Mode } from '@/hooks/use-react-flow';
import { ColorModeContext } from '@/contexts/color-mode';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

export const DeviceShow = () => {
  const { query: queryResult } = useShow<IDevice>({});
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const [device, setDevice] = useState<IDevice | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);

  const { mode } = useContext(ColorModeContext);

  const {
    setRfInstance,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
    onConnect,
    setNodes,
    setEdges,
    onViewportChange,
    onContextMenu,
    onPaneClick,
    ref,
    viewport,
  } = useReactFlow({ mode: Mode.CONTROL });

  const handleChannelChange = useCallback(
    (name: string, value: string) => {
      if (!device || !record?.id) return;

      const updatedChannels: IChannel[] = device.channels.map(channel =>
        channel.name === name ? { ...channel, value } : channel
      );

      const channelExists = device.channels.some(channel => channel.name === name);

      if (!channelExists) {
        updatedChannels.push({ name, value, unit: '', type: '' });
      }

      setDevice(prev => (prev ? { ...prev, channels: updatedChannels } : null));

      socket.emit('device/update', {
        id: record.id,
        channels: updatedChannels,
      });
    },
    [device, record?.id]
  );

  const handleDeviceUpdate = useCallback(
    (updatedDevice: IDevice) => {
      if (updatedDevice.id === record?.id) {
        setDevice(updatedDevice);
      }
    },
    [record?.id]
  );

  const fetchDeviceToken = async () => {
    if (!device) return;
    try {
      const { data } = await axiosInstance.get(`/devices/${device.id}/password`);
      setDeviceToken(`${data.deviceKey}-${data.deviceToken}`);
      message.success('Device token created!');
    } catch (error: any) {
      message.error('Failed to create device token.');
    }
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
  }, [record, handleDeviceUpdate]);

  useEffect(() => {
    if (!record?.template?.prototype) return;

    const mappedNodes = (record.template.prototype.nodes || []).map(node => ({
      ...node,
      data: {
        ...node.data,
        value: device?.channels.find(c => c.name === node.data.channel)?.value,
        onChange: handleChannelChange,
      },
    }));

    setNodes(mappedNodes);
    setEdges(record.template.prototype.edges || []);
  }, [record, device?.channels, handleChannelChange, setNodes, setEdges]);

  if (!device) {
    return null;
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
          {device.lastUpdate && (
            <>
              <Title level={5} style={{ marginBottom: 0 }}>
                -
              </Title>
              <Title level={5} style={{ margin: 0 }}>
                {dayjs(device.lastUpdate).fromNow()}
              </Title>
            </>
          )}
        </Flex>

        <Flex vertical>
          <Flex gap={8} align="center">
            <Title level={5} style={{ marginBottom: 0 }}>
              Device token:
            </Title>
            {deviceToken ? (
              <Text code copyable>
                {deviceToken}
              </Text>
            ) : (
              <>
                <Text type="secondary">Click to reveal</Text>
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
            <Title level={5} style={{ marginBottom: 0 }}>
              {device.user.fullName}
            </Title>
          </Link>
        </Flex>
      </Flex>

      <div className="flex flex-col w-full h-[50vh] relative">
        <ReactFlow
          ref={ref}
          colorMode={mode as ColorMode}
          nodes={nodes}
          edges={edges}
          onInit={setRfInstance}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onViewportChange={onViewportChange}
          onContextMenu={onContextMenu}
          onPaneClick={onPaneClick}
          viewport={viewport}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </Show>
  );
};
