import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getUserLocation } from '@/utility/map';
import { IDevice } from '@/interfaces/device';
import { useMap } from 'react-leaflet';
import { deviceIcon } from './map-icons';
import { capitalize } from 'lodash';

const MapInitializer = ({
  onMapReady,
  userPosition,
  devicePosition,
}: {
  onMapReady: (map: L.Map) => void;
  userPosition: [number, number];
  devicePosition: [number, number];
}) => {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([userPosition, devicePosition]);
    map.fitBounds(bounds, { padding: [50, 50] }); // padding to avoid marker clipping
    onMapReady(map);
  }, [map, onMapReady, userPosition, devicePosition]);

  return null;
};

type Props = {
  device: IDevice;
};

export const DeviceMap: React.FC<Props> = ({ device }) => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const devicePosition: [number, number] = [
    device.position.coordinates[1],
    device.position.coordinates[0],
  ];

  useEffect(() => {
    getUserLocation(
      (lat, lng) => setUserPosition([lat, lng]),
      () => setUserPosition([10.762622, 106.660172])
    );

    setTimeout(() => {
      mapRef.current?.invalidateSize(); // sẽ được gọi trong MapInitializer
    }, 300);
  }, []);

  if (!userPosition) return null;
  return (
    <MapContainer center={devicePosition} zoom={14} style={{ height: '100%', width: '100%' }}>
      <MapInitializer
        onMapReady={map => (mapRef.current = map)}
        userPosition={userPosition}
        devicePosition={devicePosition}
      />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        key={device.id}
        position={[device.position.coordinates[1], device.position.coordinates[0]]}
        icon={deviceIcon}
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

      <Marker position={userPosition}>
        <Popup>
          <strong>Your Position</strong>
        </Popup>
      </Marker>
    </MapContainer>
  );
};
