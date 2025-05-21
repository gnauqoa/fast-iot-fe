import { memo } from 'react';
import { BaseNode } from '../base';
import { ENodeTypes } from '@/interfaces/node';
import { Typography } from 'antd';
import { TagOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface DraggableLabelNodeProps {
  onDragStart?: (event: React.DragEvent<HTMLDivElement>, nodeType: string) => void;
}

export const DraggableLabelNode = memo(({ onDragStart }: DraggableLabelNodeProps) => {
  return (
    <div
      draggable
      onDragStart={e => onDragStart?.(e, ENodeTypes.label)}
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
          <TagOutlined className="text-muted-foreground" />
          <p className="text-foreground font-medium">Label</p>
        </div>
        <Title level={4} style={{ margin: 0 }}>
          Value
        </Title>
      </BaseNode>
    </div>
  );
});

DraggableLabelNode.displayName = 'DraggableLabelNode';
