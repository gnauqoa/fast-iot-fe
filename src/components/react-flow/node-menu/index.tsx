import { ReactNode, useEffect } from 'react';
import { Node, OnNodesChange } from '@xyflow/react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/radix/tabs';
import { getNodeProperties } from '@/utility/node';
import { ENodeTypes } from '@/interfaces/node';
import { cn } from '@/utility/tailwind';

export type NodeMenuProps = {
  node?: Node | null;
  onNodeChange: OnNodesChange;
};

export type NodeMenuType = (props: NodeMenuProps) => ReactNode;

const NodeMenu: NodeMenuType = ({ node, onNodeChange }) => {
  const open = !!node;

  const NodeProperties = node?.type ? getNodeProperties(node.type as ENodeTypes) : null;

  const handleDataChange = (key: string, value: any) => {
    if (!node) return;

    onNodeChange([
      {
        id: node.id,
        type: 'replace',
        item: {
          ...node,
          data: {
            ...node.data,
            [key]: value,
          },
        },
      },
    ]);
  };

  if (!open) return <></>;

  return (
    <div className={cn('absolute right-0 z-20 flex h-[100%] w-[250px] flex-col bg-card shadow-xl')}>
      <Tabs defaultValue="properties" className="w-full b-">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="style">Styles</TabsTrigger>
        </TabsList>
        <TabsContent value="properties">
          {NodeProperties && (
            <NodeProperties
              data={
                node?.data || {
                  channel: '',
                  label: '',
                }
              }
              onDataChange={handleDataChange}
            />
          )}
        </TabsContent>
        <TabsContent value="style"></TabsContent>
      </Tabs>
    </div>
  );
};

export default NodeMenu;
