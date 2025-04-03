import { Link, useShow } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import { Badge, Button, Col, Flex, message, Row, Typography } from "antd";
import { DeviceStatus, IDevice } from "../../interfaces/device";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { socket } from "../../providers/liveProvider";
import { capitalize } from "../../utility/text";
import { SensorCard, SliderCard, SwitchCard } from "../../components/card";
import {
  HANDLE_DEVICE_DATA_CHANNEL,
  JOIN_DEVICE_ROOM_CHANNEL,
  LEAVE_DEVICE_ROOM_CHANNEL,
  UPDATE_DEVICE_CHANNEL,
} from "../../constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons"; // Import icons từ Ant Design
import { axiosInstance } from "@refinedev/nestjsx-crud";

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
      const response = await axiosInstance.get(
        `/devices/${device.id}/password`
      );
      setDeviceToken(response.data.device_pass);
      message.success("Device token created!");
    } catch (error) {
      message.error("Failed to create device token.");
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
            status={device.status === DeviceStatus.Online ? "success" : "error"}
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
                <Typography.Text type="secondary">
                  Click to reveal
                </Typography.Text>
                <Button
                  icon={deviceToken ? <ReloadOutlined /> : <EyeOutlined />}
                  onClick={fetchDeviceToken}
                />
              </>
            )}
          </Flex>
        </Flex>

        <Flex>
          <Link to={`/users/${device.user_id}`}>
            <Title level={5}>{device.user.fullName}</Title>
          </Link>
        </Flex>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <SensorCard
              icon={
                <Icon
                  icon="material-symbols-light:humidity-percentage-outline"
                  width="32"
                  height="32"
                />
              }
              title="Humidity"
              value={device.humi}
              uint="%"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <SensorCard
              icon={<Icon icon="circum:temp-high" width="32" height="32 " />}
              title="Temperature"
              value={device.temp}
              uint="°C"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <SensorCard
              icon={
                <Icon
                  icon="material-symbols-light:water-lux-outline"
                  width="32"
                  height="32"
                />
              }
              title="Light"
              value={device.lux}
              uint="lux"
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <SwitchCard
              title="Button 1"
              value={device.btn1}
              onChange={(checked) => {
                socket.emit(UPDATE_DEVICE_CHANNEL, {
                  ...device,
                  btn1: checked,
                } as IDevice);
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <SwitchCard
              title="Button 2"
              value={device.btn2}
              onChange={(checked) => {
                socket.emit(UPDATE_DEVICE_CHANNEL, {
                  ...device,
                  btn2: checked,
                } as IDevice);
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <SwitchCard
              title="Light"
              value={device.btn3}
              onChange={(checked) => {
                socket.emit(UPDATE_DEVICE_CHANNEL, {
                  ...device,
                  btn3: checked,
                } as IDevice);
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <SwitchCard
              title="Pump"
              value={device.btn4}
              onChange={(checked) => {
                socket.emit(UPDATE_DEVICE_CHANNEL, {
                  ...device,
                  btn4: checked,
                } as IDevice);
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <SwitchCard
              title="Auto control"
              value={device.autoControl}
              onChange={(checked) => {
                socket.emit(UPDATE_DEVICE_CHANNEL, {
                  ...device,
                  autoControl: checked,
                } as IDevice);
              }}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <SliderCard
              title="Temp Range"
              value={device.tempRange || 0}
              min={0}
              max={100}
              step={1}
              onChange={(value) => {
                setDevice({ ...device, tempRange: value });
              }}
              onFinalChange={(value) => {
                socket.emit(UPDATE_DEVICE_CHANNEL, {
                  ...device,
                  tempRange: value,
                });
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <SliderCard
              title="Humi Range"
              value={device.humiRange || 0}
              min={0}
              max={100}
              step={1}
              onChange={(value) => {
                setDevice({ ...device, humiRange: value });
              }}
              onFinalChange={(value) => {
                socket.emit(UPDATE_DEVICE_CHANNEL, {
                  ...device,
                  humiRange: value,
                });
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <SliderCard
              title="Lux Range"
              value={device.luxRange || 0}
              min={0}
              max={100}
              step={1}
              onChange={(value) => {
                setDevice({ ...device, luxRange: value });
              }}
              onFinalChange={(value) => {
                socket.emit(UPDATE_DEVICE_CHANNEL, {
                  ...device,
                  luxRange: value,
                });
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <SliderCard
              title="Mosfet Speed"
              value={device.mosfetSpeed || 0}
              min={0}
              max={100}
              step={1}
              onChange={(value) => {
                setDevice({ ...device, mosfetSpeed: value });
              }}
              onFinalChange={(value) => {
                socket.emit(UPDATE_DEVICE_CHANNEL, {
                  ...device,
                  mosfetSpeed: value,
                });
              }}
            />
          </Col>
        </Row>
      </Flex>
    </Show>
  );
};
