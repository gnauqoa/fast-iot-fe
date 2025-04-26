import {
  HANDLE_DEVICE_DATA_CHANNEL,
  JOIN_DEVICE_ROOM_CHANNEL,
  LEAVE_DEVICE_ROOM_CHANNEL,
} from '@/constants';
import { IDevice } from '@/interfaces/device';
import { socket } from '@/providers/liveProvider';
import { useCallback, useEffect, useState } from 'react';

const useDeviceSocket = (deviceId: number | undefined) => {
  const [device, setDevice] = useState<IDevice | null>(null);

  const handleDeviceUpdate = useCallback((updatedDevice: IDevice) => {
    setDevice(updatedDevice);
  }, []);

  useEffect(() => {
    if (!deviceId) return;

    socket.emit(JOIN_DEVICE_ROOM_CHANNEL, deviceId);
    socket.on(HANDLE_DEVICE_DATA_CHANNEL, handleDeviceUpdate);

    return () => {
      socket.emit(LEAVE_DEVICE_ROOM_CHANNEL, deviceId);
      socket.off(HANDLE_DEVICE_DATA_CHANNEL, handleDeviceUpdate);
    };
  }, [deviceId, handleDeviceUpdate]);

  return { device, setDevice };
};

export default useDeviceSocket;
