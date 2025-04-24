import { memo } from 'react';
import { Node, NodeProps } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { BaseNode } from './base';
import { Switch } from 'antd';

export type ButtonNodeDataType = {
  handleConnectedIds?: string[];
  label: string;
};

export type ButtonNode = Node<ButtonNodeDataType>;

export const createButtonNode = (
  { label }: ButtonNodeDataType,
  { position }: { position: { x: number; y: number } }
) => {
  return {
    id: `button-${uuidv4()}`,
    type: 'button',
    data: {
      label,
    },
    position,
  };
};

export const ButtonNode = memo(({ data }: NodeProps<ButtonNode>) => {
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
      <p className="text-foreground">{data.label}</p>
      <div>
        <Switch />
      </div>
    </BaseNode>
  );
});

ButtonNode.displayName = 'ButtonNode';
