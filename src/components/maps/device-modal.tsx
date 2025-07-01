import React, { useEffect, useRef } from 'react';
import { Modal } from 'antd';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getUserLocation } from '@/utility/map';
import { IDevice } from '@/interfaces/device';
import { DeviceMap } from './device-map';

type Props = {
  open: boolean;
  onClose: () => void;
  device: IDevice;
};

export const DeviceMapModal: React.FC<Props> = ({ open, onClose, device }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (open) {
      getUserLocation(
        (_lat, _lng) => {
          // Location obtained but not used in this implementation
        },
        () => {
          // Use default location if geolocation fails
        }
      );

      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 300);
    }
  }, [open]);

  return (
    <Modal open={open} onCancel={onClose} footer={null} width="80%">
      <div style={{ height: '70vh', width: '100%' }}>
        <DeviceMap device={device} />
      </div>
    </Modal>
  );
};
