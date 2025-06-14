import { Edge, Node, Viewport } from '@xyflow/react';

export enum ChannelType {
  STRING = 'String',
  NUMBER = 'Number',
  BOOLEAN = 'Boolean',
  OBJECT = 'Object',
  SELECT = 'Select',
}

export interface IPrototype {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
}

export interface IChannelDefinition {
  name: string;
  type: ChannelType;
  options?: { label: string; value: string }[];
}

export interface ITemplate {
  id: string;
  name: string;
  description?: string;
  userId: number;
  desktopPrototype: IPrototype;
  mobilePrototype: IPrototype;
  channels: IChannelDefinition[];
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
