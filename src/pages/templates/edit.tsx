import { ContextMenu, ContextMenuTrigger } from '@/components/radix';
import { Background, ColorMode } from '@xyflow/react';
import { Controls } from '@xyflow/react';
import NodeMenu from '@/components/react-flow/node-menu';
import useReactFlow, { OnNewNodeProps } from '@/hooks/use-react-flow';
import { ReactFlow } from '@xyflow/react';
import { Button, message } from 'antd';
import { ReactFlowContextMenu } from '@/components/react-flow/context-menu';
import { DragEventHandler, useCallback, useContext, useEffect, useState } from 'react';
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
import { UndoOutlined, RedoOutlined, CopyOutlined, SnippetsOutlined } from '@ant-design/icons';
import { DraggableSelectNode } from '@/components/react-flow/nodes/select/draggable';

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
    undo,
    redo,
    canUndo,
    canRedo,
    copySelectedNodes,
    pasteNodes,
    hasCopiedNodes,
  } = useReactFlow();

  // State to track initial diagram state and changes
  const [initialState, setInitialState] = useState<{
    nodes: typeof nodes;
    edges: typeof edges;
  } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (templateData?.desktopPrototype) {
      const newNodes = (templateData.desktopPrototype?.nodes || []).map(node => ({
        ...node,
        data: {
          ...node.data,
          existingChannels: templateData.channels || [],
        },
      }));

      const newEdges = templateData.desktopPrototype?.edges || [];

      setInitialState({
        nodes: newNodes,
        edges: newEdges,
      });

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [templateData, onViewportChange, setNodes, setEdges]);

  const handleNewNode: OnNewNodeProps = useCallback(
    (type, position, data) => {
      onNewNode(type, position, {
        ...data,
        existingChannels: templateData?.channels || [],
      });
    },
    [onNewNode, templateData]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDrop(event, {
        existingChannels: templateData?.channels || [],
      });
    },
    [onDrop, templateData]
  );

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

    const nodes = (data.nodes || []).map(node => {
      const { existingChannels, ...restData } = node.data || {};
      return {
        ...node,
        data: restData,
      };
    });

    const channels = nodes.map(node => ({
      name: node.data.channel,
      type: nodeTypeToChannelType(node.type as ENodeTypes),
    }));

    const newChannels = [...(templateData?.channels || []), ...channels].filter(
      (channel, index, self) =>
        !!channel?.name && index === self.findIndex(c => c.name === channel.name)
    );

    onFinish({
      desktopPrototype: {
        nodes,
        edges: data.edges,
        viewport: { x, y, zoom },
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

  // Enhanced copy function with notification
  const handleCopy = () => {
    const copied = copySelectedNodes();
    if (copied) {
      message.success('Nodes copied to clipboard');
    } else {
      message.info('No nodes selected to copy');
    }
  };

  // Enhanced paste function with notification
  const handlePaste = () => {
    if (hasCopiedNodes) {
      pasteNodes();
      message.success('Nodes pasted');
    } else {
      message.info('No nodes to paste');
    }
  };

  // Add notification for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if we're in an input field or textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // Copy shortcut: Ctrl+C or Command+C (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        const copied = copySelectedNodes();
        if (copied) {
          message.success('Nodes copied to clipboard');
        }
      }

      // Paste shortcut: Ctrl+V or Command+V (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        if (hasCopiedNodes) {
          pasteNodes();
          message.success('Nodes pasted');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [copySelectedNodes, pasteNodes, hasCopiedNodes]);

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
              defaultViewport={viewport}
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
              onDrop={handleDrop}
              onDragStart={onDragStart as DragEventHandler<HTMLDivElement>}
            >
              <Background />
              <Controls />
              <div className="absolute right-[32px] z-20 mt-5 flex flex-row items-center gap-3">
                <Button
                  icon={<UndoOutlined />}
                  onClick={undo}
                  disabled={!canUndo}
                  title="Undo (Ctrl+Z)"
                />
                <Button
                  icon={<RedoOutlined />}
                  onClick={redo}
                  disabled={!canRedo}
                  title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
                />
                <Button
                  icon={<CopyOutlined />}
                  onClick={handleCopy}
                  disabled={!selectedNode && nodes.filter(n => n.selected).length === 0}
                  title="Copy (Ctrl+C)"
                />
                <Button
                  icon={<SnippetsOutlined />}
                  onClick={handlePaste}
                  disabled={!hasCopiedNodes}
                  title="Paste (Ctrl+V)"
                />
                <Button type="primary" onClick={handleSave} disabled={!hasChanges}>
                  Save
                </Button>
              </div>
            </ReactFlow>
          </ContextMenuTrigger>
          <ReactFlowContextMenu onNewNode={handleNewNode} menu={menu} />
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
            <div className="hover:bg-accent transition-colors rounded-md overflow-hidden cursor-grab active:cursor-grabbing">
              <DraggableSelectNode onDragStart={handleDragStart} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
