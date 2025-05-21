import { memo } from 'react';
import { Node, NodeProps } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { BaseNode } from '../base';
import { Typography } from 'antd';
export * from './draggable';

const { Title } = Typography;

export type LabelNodeDataType = {
  label: string;
  value: string;
  channel: string;
};

export type LabelNode = Node<LabelNodeDataType>;

export const createLabelNode = (
  { label, value }: LabelNodeDataType,
  { position }: { position: { x: number; y: number } }
) => {
  return {
    id: `label-${uuidv4()}`,
    type: 'label',
    data: {
      label,
      value,
    },
    position,
  };
};

export const LabelNode = memo(({ data }: NodeProps<LabelNode>) => {
  return (
    <BaseNode
      style={{
        width: 200,
        height: 100,
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <p className="text-foreground">
        {data.label} [{data.channel}]
      </p>
      <Title level={3}>{data.value ?? 0}</Title>
    </BaseNode>
  );
});

LabelNode.displayName = 'LabelNode';
