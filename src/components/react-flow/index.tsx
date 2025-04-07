import React from 'react';
import { ReactFlow, Controls, Background, Node, Edge, NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ReactFlowContextMenu } from '@/components/react-flow/context-menu';
import { Page } from '@/interfaces/page';
import { useDesignPage } from '@/hooks/use-design-page';
import { ContextMenu } from '@/components/radix/context-menu';
import { ContextMenuTrigger } from '@/components/radix/context-menu';
import { Button } from '@/components/radix/button';
import NodeMenu from '@/components/react-flow/node-menu';

const DesignView = ({
  nodeList,
  page,
}: {
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  nodeList: NodeTypes;
  page: Page;
}) => {
  const {
    nodes,
    edges,
    setRfInstance,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onSave,
    onRestore,
    onPaneClick,
    ref,
    onNewNode,
    selectedNode,
    onContextMenu,
    onNodeClick,
    onViewportChange,
    viewport,
  } = useDesignPage({
    page,
  });

  return (
    <div className="relative flex h-full w-full flex-col">
      <NodeMenu onNodeChange={onNodesChange} node={selectedNode} />
      <ContextMenu>
        <ContextMenuTrigger className="flex h-full w-full">
          <ReactFlow
            ref={ref}
            onViewportChange={onViewportChange}
            viewport={viewport}
            onContextMenu={onContextMenu}
            onPaneClick={onPaneClick}
            onInit={setRfInstance}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onNodeClick={onNodeClick}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeList}
            fitView
            attributionPosition="bottom-left"
          >
            <Background />
            <Controls />
            <div className="absolute right-[32px] z-20 mt-5 flex flex-row items-center gap-3">
              <Button onClick={onRestore}>Import</Button>
              <Button onClick={onSave}>Export</Button>
            </div>
          </ReactFlow>
        </ContextMenuTrigger>
        <ReactFlowContextMenu page={page} onNewNode={onNewNode} />
      </ContextMenu>
    </div>
  );
};

export default DesignView;
