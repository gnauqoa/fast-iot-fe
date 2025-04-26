import { ContextMenu, ContextMenuTrigger } from '@/components/radix';
import { Background, ColorMode } from '@xyflow/react';
import { Controls } from '@xyflow/react';
import NodeMenu from '@/components/react-flow/node-menu';
import useReactFlow, { Mode } from '@/hooks/use-react-flow';
import { ReactFlow } from '@xyflow/react';
import { Button } from 'antd';
import { ReactFlowContextMenu } from '@/components/react-flow/context-menu';
import { useContext, useEffect, useState } from 'react';
import { ColorModeContext } from '@/contexts/color-mode';
import { nodeTypes } from '@/utility/node';
import { useForm } from '@refinedev/core';
import { ITemplate } from '@/interfaces/template';
import isEqual from 'lodash/isEqual';

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
  } = useReactFlow({ mode: Mode.EDIT });

  // State to track initial diagram state and changes
  const [initialState, setInitialState] = useState<{
    nodes: typeof nodes;
    edges: typeof edges;
  } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (templateData?.prototype) {
      const newNodes = templateData.prototype?.nodes || [];
      const newEdges = templateData.prototype?.edges || [];

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

    onFinish({
      prototype: {
        nodes: data?.nodes,
        edges: data?.edges,
        viewport: {
          x,
          y,
          zoom,
        },
      },
    });

    setInitialState({
      nodes: data.nodes,
      edges: data.edges,
    });
  };

  return (
    <div style={{ height: `calc(100vh - ${150}px)` }} className="relative flex w-full flex-col">
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
        <ReactFlowContextMenu onNewNode={onNewNode} />
      </ContextMenu>
    </div>
  );
};
