import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import {
  Input,
  Button,
  Form,
  Space,
  Flex,
  Tooltip,
  theme,
  Select,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import { useScanDevice, DEFAULT_SCAN_PARAMS } from '@/hooks/use-scan-devices';
import {
  deviceIcon,
  pickedLocationIcon,
  currentLocationIcon,
  Loading,
  OverlayPosition,
} from '@/components/maps';
import { MapClickHandler, getUserLocation } from '@/utility/map';
import { RightOutlined, LeftOutlined, BarChartOutlined, FilterOutlined } from '@ant-design/icons';
import { IDevice, DeviceStatus, statusColors } from '@/interfaces/device';
import { DeviceMaps } from '@/components/maps/device-maps';
import { capitalize } from '@/utility/text';
import { useGetIdentity } from '@refinedev/core';
import { IUser, UserRole } from '@/interfaces/user';

export const DeviceMap = () => {
  const { data: identity } = useGetIdentity<IUser>();
  const isAdmin = identity?.role?.name === UserRole.ADMIN;

  const [userLocation, setUserLocation] = useState<[number, number]>([
    DEFAULT_SCAN_PARAMS.latitude,
    DEFAULT_SCAN_PARAMS.longitude,
  ]); // Default to Ho Chi Minh City
  const [error, setError] = useState<string>('');
  const [form] = Form.useForm();
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<[number, number] | null>(null);
  const [hoverCoordinates, setHoverCoordinates] = useState<[number, number] | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const locationInitialized = useRef(false);
  const [scanRadius, setScanRadius] = useState<number>(0.5); // Default radius in meters
  const [showDeviceList, setShowDeviceList] = useState(false);
  const [hoveredDeviceId, setHoveredDeviceId] = useState<number | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const markerRefs = useRef<Record<number, L.Marker | null>>({});
  const deviceItemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const { token } = theme.useToken();

  // Admin filtering states
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | null>(null);
  const [showStats, setShowStats] = useState(isAdmin);

  const { isLoading, data: devices, handleScan, updateLocation } = useScanDevice();

  // Calculate device statistics for admin (now using backend-filtered data)
  const deviceStats = devices
    ? {
        total: devices.length,
        online: devices.filter(d => d.status === DeviceStatus.Online).length,
        offline: devices.filter(d => d.status === DeviceStatus.Offline).length,
      }
    : { total: 0, online: 0, offline: 0 };

  useEffect(() => {
    if (!locationInitialized.current) {
      getUserLocation(
        (latitude, longitude) => {
          const newLocation: [number, number] = [latitude, longitude];
          setUserLocation(newLocation);
          updateLocation(latitude, longitude);
          locationInitialized.current = true;
        },
        errorMessage => {
          setError(errorMessage);
          locationInitialized.current = true;
        }
      );
    }
  }, [updateLocation]);

  useEffect(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.setView(userLocation, 14);
    }
  }, [userLocation, mapRef]);

  // Trigger scan when location is initialized or when status filter changes
  useEffect(() => {
    if (locationInitialized.current) {
      handleScan({
        radius: scanRadius,
        status: statusFilter || undefined,
      });
    }
  }, [statusFilter, handleScan, scanRadius]); // Include scanRadius dependency

  const handleMapClick = (lat: number, lng: number) => {
    if (isPickingLocation) {
      const newLocation: [number, number] = [lat, lng];
      setPickedLocation(newLocation);
      updateLocation(lat, lng);
      setIsPickingLocation(false);
    }
  };

  const handleMouseMove = (lat: number, lng: number) => {
    setHoverCoordinates([lat, lng]);
  };

  const startPickingLocation = () => {
    setIsPickingLocation(true);
  };

  const cancelPickingLocation = () => {
    setIsPickingLocation(false);
    setHoverCoordinates(null);
  };

  const removePickedLocation = () => {
    setPickedLocation(null);
    updateLocation(userLocation[0], userLocation[1]);
  };

  const handleScanWithRadius = async (values: { radius: number }) => {
    await handleScan({
      radius: values.radius,
      status: statusFilter || undefined,
    });
    setScanRadius(values.radius);
  };

  const toggleDeviceList = () => {
    setShowDeviceList(!showDeviceList);
  };

  const handleDeviceHover = (deviceId: number | null) => {
    setHoveredDeviceId(deviceId);

    if (deviceId === null) {
      if (selectedDeviceId !== hoveredDeviceId) {
        const marker = markerRefs.current[hoveredDeviceId || 0];
        if (marker) {
          marker.closePopup();
        }
      }
    } else {
      const marker = markerRefs.current[deviceId];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  const handleDeviceClick = (device: IDevice) => {
    setSelectedDeviceId(device.id);

    // Navigate to the device location on the map
    if (mapRef.current) {
      const devicePosition: [number, number] = [
        device.position.coordinates[1],
        device.position.coordinates[0],
      ];

      mapRef.current.setView(devicePosition, 15);
    }
  };

  const handleMarkerClick = (deviceId: number) => {
    setSelectedDeviceId(deviceId);

    // If device list is not visible, show it
    if (!showDeviceList) {
      setShowDeviceList(true);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col">
      {isAdmin && showStats && (
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            {/* Always show total count */}
            <Col span={statusFilter ? 24 : 8}>
              <Statistic
                title={statusFilter ? `Found (${capitalize(statusFilter)})` : 'Total Found'}
                value={deviceStats.total}
                prefix={<BarChartOutlined />}
                valueStyle={{
                  color: statusFilter ? statusColors[statusFilter] : token.colorText,
                }}
              />
            </Col>

            {/* Only show breakdown when no status filter is active */}
            {!statusFilter && (
              <>
                <Col span={8}>
                  <Statistic
                    title="Online"
                    value={deviceStats.online}
                    valueStyle={{ color: statusColors[DeviceStatus.Online] }}
                    prefix={
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          backgroundColor: statusColors[DeviceStatus.Online],
                          borderRadius: '50%',
                          display: 'inline-block',
                          marginRight: 4,
                        }}
                      />
                    }
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Offline"
                    value={deviceStats.offline}
                    valueStyle={{ color: statusColors[DeviceStatus.Offline] }}
                    prefix={
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          backgroundColor: statusColors[DeviceStatus.Offline],
                          borderRadius: '50%',
                          display: 'inline-block',
                          marginRight: 4,
                        }}
                      />
                    }
                  />
                </Col>
              </>
            )}
          </Row>
        </Card>
      )}

      <Form
        form={form}
        layout="inline"
        onFinish={handleScanWithRadius}
        initialValues={{ radius: 0.5 }}
        style={{ marginBottom: 16, gap: 12 }}
      >
        <Form.Item name="radius" label="Radius (km)">
          <Input type="number" min={0} max={1000} style={{ width: 150 }} />
        </Form.Item>

        {isAdmin && (
          <Form.Item label="Status Filter">
            <Select
              placeholder="All statuses"
              allowClear
              style={{ width: 150 }}
              value={statusFilter}
              onChange={value => {
                setStatusFilter(value || null);
              }}
              options={Object.values(DeviceStatus).map((status: DeviceStatus) => ({
                label: (
                  <Tag color={statusColors[status]} style={{ margin: 0 }}>
                    {capitalize(String(status))}
                  </Tag>
                ),
                value: status,
              }))}
            />
          </Form.Item>
        )}

        <Flex style={{ marginLeft: 'auto' }} vertical gap={12}>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            style={{ marginLeft: 'auto' }}
            disabled={isPickingLocation}
            icon={<FilterOutlined />}
          >
            Find Devices
          </Button>
          <Space>
            {isAdmin && (
              <Button
                onClick={() => setShowStats(!showStats)}
                icon={<BarChartOutlined />}
                size="small"
              >
                {showStats ? 'Hide Stats' : 'Stats'}
              </Button>
            )}
            {pickedLocation && (
              <Button onClick={removePickedLocation} danger size="small">
                Remove
              </Button>
            )}
            {isPickingLocation ? (
              <Button onClick={cancelPickingLocation} danger size="small">
                Cancel
              </Button>
            ) : (
              <Button onClick={startPickingLocation} size="small">
                Pick Location
              </Button>
            )}
          </Space>
        </Flex>
      </Form>

      <div
        style={{
          position: 'relative',
          height: 'calc(100vh - 250px)',
          display: 'flex',
        }}
      >
        <div
          style={{
            flex: 1,
            position: 'relative',
            transition: 'width 0.3s ease',
            width: showDeviceList ? 'calc(100% - 300px)' : '100%',
          }}
        >
          <Loading isLoading={isLoading} />
          <OverlayPosition coordinates={hoverCoordinates} />

          <MapContainer
            center={pickedLocation || userLocation}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickHandler onMapClick={handleMapClick} onMouseMove={handleMouseMove} />

            <Marker position={userLocation} icon={currentLocationIcon}>
              <Popup>
                <div>
                  <h3>Your Location</h3>
                  <p>Latitude: {userLocation[0].toFixed(6)}</p>
                  <p>Longitude: {userLocation[1].toFixed(6)}</p>
                </div>
              </Popup>
            </Marker>

            {pickedLocation && (
              <Marker position={pickedLocation} icon={pickedLocationIcon}>
                <Popup>
                  <div>
                    <h3>Selected Location</h3>
                    <p>Latitude: {pickedLocation[0].toFixed(6)}</p>
                    <p>Longitude: {pickedLocation[1].toFixed(6)}</p>
                  </div>
                </Popup>
              </Marker>
            )}

            <Circle
              center={pickedLocation || userLocation}
              radius={scanRadius * 1000}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                weight: 2,
              }}
            ></Circle>

            {devices.map(device => (
              <Marker
                key={device.id}
                position={[device.position.coordinates[1], device.position.coordinates[0]]}
                icon={deviceIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(device.id),
                  popupclose: () => setSelectedDeviceId(null),
                }}
                ref={ref => {
                  markerRefs.current[device.id] = ref;
                  if (ref && (device.id === hoveredDeviceId || device.id === selectedDeviceId)) {
                    ref.openPopup();
                  }
                }}
              >
                <Popup>
                  <div>
                    <p>
                      {device.name}
                      <span>
                        <br /> Status: {capitalize(device.status)}
                      </span>
                      <span>
                        <br /> Last Update: {new Date(device.lastUpdate).toLocaleString()}
                      </span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <Tooltip title={showDeviceList ? 'Hide Device List' : 'Show Device List'}>
          <Button
            type="default"
            shape="circle"
            icon={showDeviceList ? <RightOutlined /> : <LeftOutlined />}
            onClick={toggleDeviceList}
            style={{
              position: 'absolute',
              right: showDeviceList ? '280px' : '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1000,
              transition: 'right 0.3s ease',
              backgroundColor: token.colorBgContainer,
              borderColor: token.colorBorder,
              boxShadow: token.boxShadow,
              color: token.colorText,
            }}
          />
        </Tooltip>

        <div
          style={{
            width: showDeviceList ? '300px' : '0',
            overflow: 'hidden',
            transition: 'width 0.3s ease',
            backgroundColor: token.colorBgContainer,
            borderLeft: `1px solid ${token.colorBorder}`,
          }}
        >
          {showDeviceList && (
            <DeviceMaps
              devices={devices}
              selectedDeviceId={selectedDeviceId}
              onDeviceHover={handleDeviceHover}
              onDeviceClick={handleDeviceClick}
              deviceItemRefs={deviceItemRefs}
            />
          )}
        </div>
      </div>
    </div>
  );
};
