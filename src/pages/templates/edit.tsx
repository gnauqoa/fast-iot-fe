import { ContextMenu, ContextMenuTrigger } from '@/components/radix';
import { Background, ColorMode } from '@xyflow/react';
import { Controls } from '@xyflow/react';
import NodeMenu from '@/components/react-flow/node-menu';
import useReactFlow, { Mode } from '@/hooks/use-react-flow';
import { ReactFlow } from '@xyflow/react';
import { Button } from 'antd';
import { ReactFlowContextMenu } from '@/components/react-flow/context-menu';
import { DragEventHandler, useContext, useEffect, useState } from 'react';
import { ColorModeContext } from '@/contexts/color-mode';
import { nodeTypes, nodeTypeToChannelType } from '@/utility/node';
import { useForm } from '@refinedev/core';
import { ITemplate } from '@/interfaces/template';
import isEqual from 'lodash/isEqual';
import { ENodeTypes } from '@/interfaces/node';
import {
  DraggableButtonNode,
  DraggableLabelNode,
  DraggableSliderNode,
} from '@/components/react-flow/nodes';

export const TemplateEdit = () => {
  const { onFinish, query } = useForm<ITemplate>({
    mutationMode: 'optimistic',
    redirect: false,
  });

  const templateData = query?.data?.data;

  const { mode } = useContext(ColorModeContext);

  const {
    setRfInstance,
    selectedNode,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
    onConnect,
    setNodes,
    setEdges,
    onViewportChange,
    onContextMenu,
    onPaneClick,
    ref,
    viewport,
    onNewNode,
    rfInstance,
    setNodeDraggingType,
    onDragStart,
    onDragOver,
    onDrop,
    menu,
  } = useReactFlow();

  // State to track initial diagram state and changes
  const [initialState, setInitialState] = useState<{
    nodes: typeof nodes;
    edges: typeof edges;
  } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (templateData?.desktopPrototype) {
      const newNodes = templateData.desktopPrototype?.nodes || [];
      const newEdges = templateData.desktopPrototype?.edges || [];

      setInitialState({
        nodes: newNodes,
        edges: newEdges,
      });

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [templateData, onViewportChange, setNodes, setEdges]);

  useEffect(() => {
    if (!initialState) return;

    const currentState = { nodes, edges };
    const hasStateChanged = !isEqual(initialState, currentState);
    setHasChanges(hasStateChanged);
  }, [nodes, edges, viewport, initialState]);

  const handleSave = () => {
    const data = rfInstance?.toObject();
    if (!data) return;
    const { x, y, zoom } = data.viewport || {};

    const channels = data?.nodes.map(node => ({
      name: node.data.channel,
      type: nodeTypeToChannelType(node.type as ENodeTypes),
    }));

    const newChannels = [...(templateData?.channels || []), ...channels].filter(
      (channel, index, self) =>
        index === self.findIndex(c => c.name === channel.name) && channel?.name
    );

    onFinish({
      desktopPrototype: {
        nodes: data?.nodes,
        edges: data?.edges,
        viewport: {
          x,
          y,
          zoom,
        },
      },
      channels: newChannels,
    } as Partial<ITemplate>);

    setInitialState({
      nodes: data.nodes,
      edges: data.edges,
    });
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    setNodeDraggingType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      style={{ height: `calc(100vh - ${64 + 24 * 2}px)` }}
      className="relative flex w-full flex-row gap-4"
    >
      <div className="flex h-full w-full flex-col relative">
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
              colorMode={mode as ColorMode}
              onNodeClick={onNodeClick}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragStart={onDragStart as DragEventHandler<HTMLDivElement>}
            >
              <Background />
              <Controls />
              <div className="absolute right-[32px] z-20 mt-5 flex flex-row items-center gap-3">
                <Button onClick={handleSave} disabled={!hasChanges}>
                  Save
                </Button>
              </div>
            </ReactFlow>
          </ContextMenuTrigger>
          <ReactFlowContextMenu onNewNode={onNewNode} menu={menu} />
        </ContextMenu>
      </div>
      <div className="min-w-[240px] w-[240px] flex border-l border-border">
        <div className="flex h-full w-full flex-col px-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-1">Components</h3>
            <p className="text-sm text-muted-foreground">Drag components to the canvas</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="hover:bg-accent transition-colors rounded-md overflow-hidden cursor-grab active:cursor-grabbing">
              <DraggableButtonNode onDragStart={handleDragStart} />
            </div>
            <div className="hover:bg-accent transition-colors rounded-md overflow-hidden cursor-grab active:cursor-grabbing">
              <DraggableSliderNode onDragStart={handleDragStart} />
            </div>
            <div className="hover:bg-accent transition-colors rounded-md overflow-hidden cursor-grab active:cursor-grabbing">
              <DraggableLabelNode onDragStart={handleDragStart} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
