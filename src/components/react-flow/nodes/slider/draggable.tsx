import { memo } from 'react';
import { Slider } from 'antd';
import { BaseNode } from '../base';
import { ENodeTypes } from '@/interfaces/node';
import { SlidersFilled } from '@ant-design/icons';

interface DraggableSliderNodeProps {
  onDragStart?: (event: React.DragEvent<HTMLDivElement>, nodeType: string) => void;
}

export const DraggableSliderNode = memo(({ onDragStart }: DraggableSliderNodeProps) => {
  return (
    <div
      draggable
      onDragStart={e => onDragStart?.(e, ENodeTypes.slider)}
      className="cursor-grab active:cursor-grabbing"
    >
      <BaseNode
        style={{
          width: '100%',
          height: 100,
          flexDirection: 'column',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div className="flex items-center gap-2">
          <SlidersFilled className="text-muted-foreground" />
          <p className="text-foreground font-medium">Slider</p>
        </div>
        <div className="w-full" style={{ pointerEvents: 'none' }}>
          <Slider value={50} min={0} max={100} step={1} disabled />
        </div>
      </BaseNode>
    </div>
  );
});

DraggableSliderNode.displayName = 'DraggableSliderNode';
