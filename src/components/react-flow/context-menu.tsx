import { Plus } from 'lucide-react';
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/radix/context-menu';
import { OnNewNodeProps } from '@/hooks/use-react-flow';

export interface ReactFlowContextMenuProps {
  onNewNode: OnNewNodeProps;
  menu?: {
    originalPos?: { x: number; y: number };
  } | null;
}

export const ReactFlowContextMenu = ({ onNewNode, menu }: ReactFlowContextMenuProps) => {
  const handleAddNode = (nodeType: string) => {
    // Use the stored original position
    if (menu?.originalPos) {
      onNewNode(nodeType, menu.originalPos, {});
    } else {
      // Fallback to center position if no original position
      onNewNode(nodeType, { x: 0, y: 0 }, {});
    }
  };

  return (
    <ContextMenuContent className="w-64">
      <ContextMenuSub>
        <ContextMenuSubTrigger inset>
          <Plus className="absolute left-2 h-4 w-4" />
          Add
        </ContextMenuSubTrigger>
        <ContextMenuSubContent className="w-48">
          <ContextMenuItem onClick={() => handleAddNode('button')}>Button</ContextMenuItem>
          <ContextMenuItem onClick={() => handleAddNode('label')}>Label</ContextMenuItem>
          <ContextMenuItem onClick={() => handleAddNode('slider')}>Slider</ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
    </ContextMenuContent>
  );
};
