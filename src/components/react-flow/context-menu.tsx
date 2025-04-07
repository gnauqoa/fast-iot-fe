import { Plus } from 'lucide-react';
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/radix/context-menu';
import { OnNewNodeProps } from '@/hooks/use-react-flow';
import { Page } from '@/interfaces/page';

interface ReactFlowContextMenuProps {
  onNewNode: OnNewNodeProps;
  page: Page;
}

export const ReactFlowContextMenu = ({ onNewNode, page }: ReactFlowContextMenuProps) => {
  return (
    <ContextMenuContent className="w-64">
      <ContextMenuSub>
        <ContextMenuSubTrigger inset>
          <Plus className="absolute left-2 h-4 w-4" />
          Add
        </ContextMenuSubTrigger>
        <ContextMenuSubContent className="w-48">
          {page === Page.CLOCK ? (
            <>
              <ContextMenuItem
                onClick={e => {
                  onNewNode(
                    'mux',
                    {
                      x: 0,
                      y: 0,
                    },
                    {
                      inputPort: 2,
                    }
                  );
                }}
              >
                Mux
              </ContextMenuItem>
              <ContextMenuItem
                onClick={e => {
                  onNewNode('output', {
                    x: 0,
                    y: 0,
                  });
                }}
              >
                Output
              </ContextMenuItem>
              <ContextMenuItem
                onClick={e => {
                  onNewNode('input', {
                    x: 0,
                    y: 0,
                  });
                }}
              >
                Input
              </ContextMenuItem>
              <ContextMenuItem
                onClick={e => {
                  onNewNode('buffer', {
                    x: 0,
                    y: 0,
                  });
                }}
              >
                Buffer
              </ContextMenuItem>
              <ContextMenuItem
                onClick={e => {
                  onNewNode('clock-gate', {
                    x: 0,
                    y: 0,
                  });
                }}
              >
                Clock gate
              </ContextMenuItem>
              <ContextMenuItem
                onClick={e => {
                  onNewNode(
                    'clock-div',
                    {
                      x: 0,
                      y: 0,
                    },
                    {
                      ratioWd: 1,
                      ratioNumber: 1,
                      clockEn: false,
                      automaticDiv: false,
                    }
                  );
                }}
              >
                Clock div
              </ContextMenuItem>
              <ContextMenuItem
                onClick={e => {
                  onNewNode(
                    'pll-controller',
                    {
                      x: 0,
                      y: 0,
                    },
                    {}
                  );
                }}
              >
                PLL controller
              </ContextMenuItem>
            </>
          ) : (
            <>
              <ContextMenuItem
                onClick={e => {
                  onNewNode('reset-src', {
                    x: 0,
                    y: 0,
                  });
                }}
              >
                Reset src
              </ContextMenuItem>
              <ContextMenuItem
                onClick={e => {
                  onNewNode(
                    'reset-output',
                    {
                      x: 0,
                      y: 0,
                    },
                    {}
                  );
                }}
              >
                Reset output
              </ContextMenuItem>
              <ContextMenuItem
                onClick={e => {
                  onNewNode(
                    'reset-mux',
                    {
                      x: 0,
                      y: 0,
                    },
                    {
                      inputPort: 1,
                    }
                  );
                }}
              >
                Reset mux
              </ContextMenuItem>
            </>
          )}
        </ContextMenuSubContent>
      </ContextMenuSub>
    </ContextMenuContent>
  );
};
