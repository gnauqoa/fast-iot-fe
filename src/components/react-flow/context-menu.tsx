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
}

export const ReactFlowContextMenu = ({ onNewNode }: ReactFlowContextMenuProps) => {
  return (
    <ContextMenuContent className="w-64">
      <ContextMenuSub>
        <ContextMenuSubTrigger inset>
          <Plus className="absolute left-2 h-4 w-4" />
          Add
        </ContextMenuSubTrigger>
        <ContextMenuSubContent className="w-48">
          <ContextMenuItem
            onClick={() => {
              onNewNode(
                'button',
                {
                  x: 0,
                  y: 0,
                },
                {}
              );
            }}
          >
            Button
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              onNewNode(
                'label',
                {
                  x: 0,
                  y: 0,
                },
                {}
              );
            }}
          >
            Label
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              onNewNode('slider', { x: 0, y: 0 }, {});
            }}
          >
            Slider
          </ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
    </ContextMenuContent>
  );
};
