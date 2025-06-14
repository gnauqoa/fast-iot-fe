import { memo } from 'react';
import { Select } from 'antd';
import { BaseNode } from '../base';
import { ENodeTypes } from '@/interfaces/node';
import { DownOutlined } from '@ant-design/icons';

interface DraggableSelectNodeProps {
  onDragStart?: (event: React.DragEvent<HTMLDivElement>, nodeType: string) => void;
}

export const DraggableSelectNode = memo(({ onDragStart }: DraggableSelectNodeProps) => {
  return (
    <div
      draggable
      onDragStart={e => onDragStart?.(e, ENodeTypes.select)}
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
          <DownOutlined className="text-muted-foreground" />
          <p className="text-foreground font-medium">Select</p>
        </div>
        <div>
          <Select
            style={{ width: '100%' }}
            value={undefined}
            options={[
              { label: 'Option 1', value: '1' },
              { label: 'Option 2', value: '2' },
            ]}
            onChange={() => {}}
          />
        </div>
      </BaseNode>
    </div>
  );
});

DraggableSelectNode.displayName = 'DraggableSelectNode';
