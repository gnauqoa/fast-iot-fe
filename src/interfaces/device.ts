import { IUser } from './user';

export enum DeviceStatus {
  Online = 'online',
  Offline = 'offline',
}

export const statusColors: Record<DeviceStatus, string> = {
  [DeviceStatus.Online]: 'green',
  [DeviceStatus.Offline]: 'red',
};

export interface PostGISPoint {
  type: string;
  coordinates: [number, number];
}

export interface IDevice {
  id: number;
  name: string;
  lastUpdate: Date;
  status: DeviceStatus;
  position: PostGISPoint;
  user: IUser;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
