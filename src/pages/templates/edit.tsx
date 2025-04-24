import { ContextMenu, ContextMenuTrigger } from '@/components/radix';
import { Background, ColorMode } from '@xyflow/react';
import { Controls } from '@xyflow/react';
import NodeMenu from '@/components/react-flow/node-menu';
import useReactFlow from '@/hooks/use-react-flow';
import { ReactFlow } from '@xyflow/react';
import { Button, Flex } from 'antd';
import { nodeList } from '@/interfaces/node';
import { Edit, useForm } from '@refinedev/antd';
import { ITemplate } from '@/interfaces/template';
import { ReactFlowContextMenu } from '@/components/react-flow/context-menu';
import { useContext } from 'react';
import { ColorModeContext } from '@/contexts/color-mode';

export const TemplateEdit = () => {
  const { formProps, saveButtonProps, query, onFinish } = useForm<ITemplate>({
    mutationMode: 'optimistic',
  });

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
    onRestore,
    onSave,
    onViewportChange,
    onContextMenu,
    onPaneClick,
    ref,
    viewport,
  } = useReactFlow();

  return (
    <div
      style={{ height: `calc(100vh - ${150}px)` }}
      className="relative flex  w-full flex-col bg-[#fff]"
    >
      <NodeMenu onNodeChange={onNodesChange} node={selectedNode} />
      <ContextMenu>
        <ContextMenuTrigger className="flex h-full w-full">
          <ReactFlow
            colorMode={mode as ColorMode}
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
        <ReactFlowContextMenu />
      </ContextMenu>
    </div>
  );
};
