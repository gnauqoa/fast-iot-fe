import { memo } from 'react';
import { Node, NodeProps } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { BaseNode } from '../base';
import { Select } from 'antd';
import { ChannelType } from '@/interfaces/template';
import { ENodeTypes } from '@/interfaces/node';
export * from './properties';
export * from './draggable';

export type SelectNodeDataType = {
  label: string;
  channel: string;
  channelType: ChannelType;
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (name: string, value: any) => void;
};

export type SelectNode = Node<SelectNodeDataType>;

export const createSelectNode = (
  { label, channel, options, value }: SelectNodeDataType,
  { position }: { position: { x: number; y: number } }
) => {
  return {
    id: `select-${uuidv4()}`,
    type: ENodeTypes.select,
    data: {
      label,
      channel,
      options,
      value,
      channelType: ChannelType.SELECT,
    },
    position,
  };
};

export const SelectNode = memo(({ data }: NodeProps<SelectNode>) => {
  return (
    <BaseNode
      className="nopan relative"
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
        <Select
          style={{
            width: '100%',
          }}
          value={data.value}
          options={data.options}
          onChange={value => {
            data.onChange?.(data.channel, value);
          }}
          labelRender={label => <span className="text-[10px]">{label.label}</span>}
        />
      </div>
    </BaseNode>
  );
});

SelectNode.displayName = 'SelectNode';
