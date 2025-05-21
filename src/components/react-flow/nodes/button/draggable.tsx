import { memo } from 'react';
import { Switch } from 'antd';
import { BaseNode } from '../base';
import { ENodeTypes } from '@/interfaces/node';
import { PoweroffOutlined } from '@ant-design/icons';

interface DraggableButtonNodeProps {
  onDragStart?: (event: React.DragEvent<HTMLDivElement>, nodeType: string) => void;
}

export const DraggableButtonNode = memo(({ onDragStart }: DraggableButtonNodeProps) => {
  return (
    <div
      draggable
      onDragStart={e => onDragStart?.(e, ENodeTypes.button)}
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
          <PoweroffOutlined className="text-muted-foreground" />
          <p className="text-foreground font-medium">Button</p>
        </div>
        <div>
          <Switch checked={false} onChange={() => {}} />
        </div>
      </BaseNode>
    </div>
  );
});

DraggableButtonNode.displayName = 'DraggableButtonNode';
