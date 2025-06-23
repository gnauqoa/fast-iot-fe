import { ITemplate } from './template';
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

export type IChannelValue = string | number | boolean | object;

export interface IChannel extends Record<string, any> {
  id: string;
  deviceId: number;
  name: string;
  value: IChannelValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDevice {
  id: number;
  name: string;
  lastUpdate: Date;
  status: DeviceStatus;
  position: PostGISPoint;
  user: IUser;
  template: ITemplate;
  channels: IChannel[];
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
