import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Input, Button, Form, Space, Flex, Tooltip, theme } from 'antd';
import { useScanDevice, DEFAULT_SCAN_PARAMS } from '@/hooks/use-scan-devices';
import {
  deviceIcon,
  pickedLocationIcon,
  currentLocationIcon,
  Loading,
  OverlayPosition,
} from '@/components/maps';
import { MapClickHandler, getUserLocation } from '@/utility/map';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { IDevice } from '@/interfaces/device';
import { DeviceList } from '@/components/maps/list';
import { capitalize } from '@/utility/text';

export const DeviceMap = () => {
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

  const { isLoading, data: devices, handleScan, updateLocation } = useScanDevice();

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
    setScanRadius(values.radius);
    await handleScan(values);
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
    <>
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
        <Flex style={{ marginLeft: 'auto' }} vertical gap={12}>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            style={{ marginLeft: 'auto' }}
            disabled={isPickingLocation}
          >
            Find
          </Button>
          <Space>
            {' '}
            {pickedLocation && (
              <Button onClick={removePickedLocation} danger>
                Remove
              </Button>
            )}
            {isPickingLocation ? (
              <Button onClick={cancelPickingLocation} danger>
                Cancel
              </Button>
            ) : (
              <Button onClick={startPickingLocation}>Pick Location</Button>
            )}
          </Space>
        </Flex>
      </Form>

      <div
        style={{
          height: 'calc(100vh - 250px)',
          position: 'relative',
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
            <DeviceList
              devices={devices}
              selectedDeviceId={selectedDeviceId}
              onDeviceHover={handleDeviceHover}
              onDeviceClick={handleDeviceClick}
              deviceItemRefs={deviceItemRefs}
            />
          )}
        </div>
      </div>
    </>
  );
};
