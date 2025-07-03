import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useShow } from '@refinedev/core';
import { DeleteButton, EditButton, Show } from '@refinedev/antd';
import { Badge, Button, Flex, message, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Background, ColorMode, Controls, Node, ReactFlow } from '@xyflow/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DeviceStatus, IDevice } from '@/interfaces/device';
import { socket } from '@/utility/socket';
import { capitalize } from '@/utility/text';
import { nodeTypes } from '@/utility/node';
import {
  HANDLE_DEVICE_DATA_CHANNEL,
  JOIN_DEVICE_ROOM_CHANNEL,
  LEAVE_DEVICE_ROOM_CHANNEL,
} from '@/constants';
import { axiosInstance } from '@refinedev/nestjsx-crud';
import useReactFlow from '@/hooks/use-react-flow';
import { ColorModeContext } from '@/contexts/color-mode';
import { MapPinned } from 'lucide-react';
import { DeviceMapModal } from '@/components/maps';
import { useNavigate } from 'react-router';
import { DeviceModal } from '@/components/devices';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

export const DeviceShow = () => {
  const { query: queryResult } = useShow<IDevice>({});
  const { data, isLoading } = queryResult;
  const [open, setOpen] = useState(false);
  const [editDevice, setEditDevice] = useState(false);
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
    onContextMenu,
    onPaneClick,
    viewport,
    ref,
    onViewportChange,
  } = useReactFlow();

  const updateView = useCallback(
    (updated: IDevice) => {
      if (!record?.template?.desktopPrototype) return;
      const deviceData = device || record;
      const updateDevice = (updated: Partial<IDevice>) => {
        const newDevice = { ...deviceData, ...updated };
        setDevice(newDevice);

        const nodesWithValues = (newDevice.template.desktopPrototype.nodes || []).reduce(
          (acc, node) => {
            const channel = newDevice.channels.find(ch => ch.name === node.data.channel);

            acc.push({
              ...node,
              data: { ...node.data, value: channel?.value, onChange: handleChannelChange },
            });

            return acc;
          },
          [] as Node[]
        );
        setNodes(nodesWithValues);
        setEdges(newDevice.template.desktopPrototype.edges || []);
      };

      const handleChannelChange = (name: string, value: string | number | boolean | object) => {
        if (!deviceData) return;

        const channelPrototype = deviceData.template.channels.find(ch => ch.name === name);
        if (!channelPrototype) return;

        // updateDevice({
        //   channels: deviceData.channels.map(ch => (ch.name === name ? { ...ch, value } : ch)),
        // });
        socket.emit('device/update', {
          id: deviceData.id,
          channels: [
            {
              name,
              value,
            },
          ],
        });
      };

      updateDevice(updated);
    },
    [device, record, setNodes, setEdges]
  );

  // Sync updated device from socket event
  const handleDeviceUpdate = useCallback(
    (updated: IDevice) => {
      if (updated.id === record?.id) {
        updateView(updated);
      }
    },
    [record?.id, updateView]
  );

  // Fetch the device token from API
  const fetchDeviceToken = async () => {
    if (!device) return;

    try {
      const { data } = await axiosInstance.get(`/devices/${device.id}/password`);
      setDeviceToken(`${data.deviceKey}-${data.deviceToken}`);
      message.success('Device token created!');
    } catch {
      message.error('Failed to create device token.');
    }
  };

  // Setup initial device state and socket listeners
  useEffect(() => {
    if (!record) return;
    updateView(record);
    console.log('record', record);
    socket.emit(JOIN_DEVICE_ROOM_CHANNEL, record.id);
    socket.on(HANDLE_DEVICE_DATA_CHANNEL, handleDeviceUpdate);

    return () => {
      socket.emit(LEAVE_DEVICE_ROOM_CHANNEL, record.id);
      socket.off(HANDLE_DEVICE_DATA_CHANNEL, handleDeviceUpdate);
    };
  }, [record]);

  if (!device) return <></>;

  return (
    <Show
      headerProps={{ style: { paddingBlockStart: 0 } }}
      isLoading={isLoading}
      headerButtons={[]}
      goBack={false}
      title={''}
    >
      <DeviceMapModal open={open} onClose={() => setOpen(false)} device={device} />

      <Flex vertical gap={12}>
        <Flex gap={12} align="center" style={{ width: '100%' }}>
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
          <Flex
            style={{
              marginLeft: 'auto',
              gap: 8,
            }}
          >
            <EditButton
              onClick={() => {
                setEditDevice(true);
              }}
            />
            <DeleteButton recordItemId={device.id} />
          </Flex>
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
                <Button icon={<EyeOutlined size={14} />} onClick={fetchDeviceToken} />
              </>
            )}
          </Flex>
          <Flex gap={8} align="center">
            <Title level={5} style={{ marginBottom: 0 }}>
              Position:
            </Title>
            <Text>
              {device.position.coordinates[1]}, {device.position.coordinates[0]}
            </Text>
            <Button icon={<MapPinned size={14} />} onClick={() => setOpen(true)} />
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
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          ref={ref}
          colorMode={mode as ColorMode}
          nodes={nodes}
          defaultViewport={viewport}
          onViewportChange={onViewportChange}
          edges={edges}
          onInit={setRfInstance}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onContextMenu={onContextMenu}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </Show>
  );
};
