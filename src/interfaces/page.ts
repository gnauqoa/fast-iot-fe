import { Edge, Node, ReactFlowInstance, Viewport } from '@xyflow/react';

export type IDesignPage = {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  rfInstance: ReactFlowInstance | null;
};

export type IQPCHConfigPage = {
  pchCount: number;
  qchCount: number;
  pchConfig: { pActiveWidth: number; pStateWidth: number }[];
};

export type IAPRCMConfigPage = {
  ramSize: number;
  romSize: number;
  intWidth: number;
};

export enum PRCMType {
  APRCM = 'APRCM',
  PPRCM = 'PPRCM',
}

export enum ResetFilterType {
  SW = 'SW',
  HW = 'HW',
}

export type IPRCMPage = {
  name: string;
  prcmType: PRCMType;
  resetFilterType: ResetFilterType;
  resetNumber: number;
  padNumber: number;
  padDelayCell: number;
};

export type IGeneralPage = {
  prcm: IPRCMPage;
  qpch: IQPCHConfigPage;
  aprcm: IAPRCMConfigPage;
};

export enum Page {
  CLOCK = 'clock',
  RESET = 'reset',
  GENERAL = 'general',
}

export type IPage = {
  clockPage: IDesignPage;
  resetPage: IDesignPage;
  generalPage: IGeneralPage;
};
