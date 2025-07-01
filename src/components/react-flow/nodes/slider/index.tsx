import { memo, useState } from 'react';
import { Node, NodeProps } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { BaseNode } from '../base';
import { Slider } from 'antd';
import { ChannelType } from '@/interfaces/template';
export * from './properties';
export * from './draggable';

export type SliderNodeDataType = {
  label: string;
  channel: string;
  channelType: ChannelType;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (name: string, value: number) => void;
};

export interface ISliderNode extends Node<SliderNodeDataType> {
  data: SliderNodeDataType;
  position: { x: number; y: number };
}

export const createSliderNode = (
  { label, channel, value, min = 0, max = 100, step = 1 }: SliderNodeDataType,
  { position }: { position: { x: number; y: number } }
) => {
  return {
    id: `slider-${uuidv4()}`,
    type: 'slider',
    data: {
      label,
      channel,
      value: value ?? min,
      min,
      max,
      step,
      channelType: ChannelType.NUMBER,
    },
    position,
  };
};

export const SliderNode = memo(({ data }: NodeProps<ISliderNode>) => {
  const [currentValue, setCurrentValue] = useState(Number(data.value) ?? data.min ?? 0);

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
      <div className="w-full nopan" style={{ pointerEvents: 'all' }}>
        <Slider
          value={currentValue}
          min={data.min ?? 0}
          max={data.max ?? 100}
          step={data.step ?? 1}
          onChange={value => {
            setCurrentValue(value);
          }}
          onChangeComplete={value => {
            data.onChange?.(data.channel, value);
          }}
        />
      </div>
    </BaseNode>
  );
});

SliderNode.displayName = 'SliderNode';
