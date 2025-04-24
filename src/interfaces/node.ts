import { NodeTypes as ReactFlowNodeTypes } from '@xyflow/react';

export enum NodeTypes {
  mux = 'mux',
  output = 'output',
  input = 'input',
  buffer = 'buffer',
  'clock-gate' = 'clock-gate',
  'clock-div' = 'clock-div',
  'pll-controller' = 'pll-controller',
  'reset-src' = 'reset-src',
  'reset-output' = 'reset-output',
  'reset-mux' = 'reset-mux',
}

export interface NodePropertiesProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDataChange: (key: string, value: any) => void;
}

export interface NodePropertiesType {
  (props: NodePropertiesProps): JSX.Element;
}

export interface NodeAttribute {
  key: string;
  type: string;
  hidden?: boolean;
}

export const nodeList: ReactFlowNodeTypes = {};
