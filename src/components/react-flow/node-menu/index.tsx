import { ReactNode } from 'react';
import { Node, OnNodesChange } from '@xyflow/react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/radix/tabs';

export type NodeMenuProps = {
  node?: Node | null;
  onNodeChange: OnNodesChange;
};

export type NodeMenuType = (props: NodeMenuProps) => ReactNode;

const NodeMenu: NodeMenuType = ({ node }) => {
  const open = !!node;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const handleDataChange = (key: string, value: any) => {
  //   if (!node) return;

  //   onNodeChange([
  //     {
  //       id: node.id,
  //       type: 'replace',
  //       item: {
  //         ...node,
  //         data: {
  //           ...node.data,
  //           [key]: value,
  //         },
  //       },
  //     },
  //   ]);
  // };

  if (!open) return <></>;

  return (
    <div className="absolute right-0 z-20 flex h-[100vh] w-[20%] flex-col bg-background shadow-xl">
      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="style">Styles</TabsTrigger>
        </TabsList>
        <TabsContent value="properties"></TabsContent>
        <TabsContent value="style"></TabsContent>
      </Tabs>
    </div>
  );
};

export default NodeMenu;
