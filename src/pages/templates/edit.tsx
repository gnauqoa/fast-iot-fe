import { ContextMenu, ContextMenuTrigger } from '@/components/radix';
import { Background } from '@xyflow/react';
import { Controls } from '@xyflow/react';
import NodeMenu from '@/components/react-flow/node-menu';
import useReactFlow from '@/hooks/use-react-flow';
import { ReactFlow } from '@xyflow/react';
import { Avatar, Button, Flex, Typography } from 'antd';
import { nodeList } from '@/interfaces/node';

const { Title } = Typography;
export const TemplateEdit = () => {
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
    <>
      <Flex>
        <Avatar />
        <Button style={{ marginLeft: 'auto' }} color="purple">
          Save
        </Button>
      </Flex>

      <Title level={3} style={{ marginTop: 12 }}>
        Web dashboard
      </Title>

      <Flex gap={12}>
        {/* <Flex vertical style={{ minHeight: "15%" }}></Flex> */}
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
            {/* <ReactFlowContextMenu onNewNode={onNewNode} /> */}
          </ContextMenu>
        </div>
      </Flex>
    </>
  );
};
