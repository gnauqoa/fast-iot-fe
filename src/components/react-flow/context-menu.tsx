import { Plus } from 'lucide-react';
import {
  ContextMenuContent,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/radix/context-menu';
import { OnNewNodeProps } from '@/hooks/use-react-flow';

export interface ReactFlowContextMenuProps {
  onNewNode: OnNewNodeProps;
}

export const ReactFlowContextMenu = () => {
  return (
    <ContextMenuContent className="w-64">
      <ContextMenuSub>
        <ContextMenuSubTrigger inset>
          <Plus className="absolute left-2 h-4 w-4" />
          Add
        </ContextMenuSubTrigger>
        <ContextMenuSubContent className="w-48"> </ContextMenuSubContent>
      </ContextMenuSub>
    </ContextMenuContent>
  );
};
