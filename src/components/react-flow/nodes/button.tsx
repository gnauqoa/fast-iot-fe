import { memo } from 'react';
import { Node, NodeProps } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { BaseNode } from './base';
import { Switch } from 'antd';
import { ChannelType } from '@/interfaces/template';

export type ButtonNodeDataType = {
  label: string;
  channel: string;
  channelType: ChannelType;
  value?: any;
  onChange?: (name: string, value: any) => void;
};

export type ButtonNode = Node<ButtonNodeDataType>;

export const createButtonNode = (
  { label, channel, value }: ButtonNodeDataType,
  { position }: { position: { x: number; y: number } }
) => {
  return {
    id: `button-${uuidv4()}`,
    type: 'button',
    data: {
      label,
      channel,
      value,
      channelType: ChannelType.BOOLEAN,
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
      <p className="text-foreground">
        {data.label} [{data.channel}]
      </p>
      <div>
        <Switch
          value={Boolean(data?.value)}
          onChange={checked => {
            data.onChange?.(data.channel, checked ? true : false);
          }}
        />
      </div>
    </BaseNode>
  );
});

ButtonNode.displayName = 'ButtonNode';
