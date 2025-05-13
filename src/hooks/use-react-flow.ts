import { downloadObj } from '@/utility/file';
import { capitalizeFirstLetter } from '@/utility/string';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlowInstance,
  Viewport,
} from '@xyflow/react';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

export enum Mode {
  EDIT = 1,
  VIEW = 0,
  CONTROL = 2,
}

export type OnNewNodeProps = (
  type: string,
  position?: { x: number; y: number },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
) => void;

export const getHandleConnectedId = (nodeId: string, edges: Edge[]) => {
  const _edges = edges.filter(e => e.source === nodeId || e.target === nodeId);

  const nodeIds: string[] = [];

  _edges.forEach(edge => {
    if (edge.source === nodeId && !nodeIds.includes(edge.source)) {
      nodeIds.push(edge?.sourceHandle || '');
    }
    if (edge.target === nodeId && !nodeIds.includes(edge.target)) {
      nodeIds.push(edge?.targetHandle || '');
    }
  });

  return nodeIds;
};

export type UseReactFlowReturnType = {
  nodes: Node[];
  edges: Edge[];
  rfInstance: ReactFlowInstance | null;
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  setRfInstance: (instance: ReactFlowInstance) => void;
  onPaneClick: () => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onViewportChange: (viewport: Viewport) => void;
  viewport: Viewport;
  onConnect: OnConnect;
  onSave: () => void;
  onRestore: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  selectedNode?: Node | null;
  selectedNodeId: string | null;
  menu: {
    id?: string;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  } | null;
  onCloseMenu: () => void;
  onNewNode: OnNewNodeProps;
  ref: React.RefObject<HTMLDivElement>;
  setViewport: Dispatch<SetStateAction<Viewport>>;
};

const useReactFlow = ({
  mode = Mode.EDIT,
}: {
  mode?: Mode | undefined;
}): UseReactFlowReturnType => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    zoom: 1,
  });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const [menu, setMenu] = useState<{
    id?: string;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  } | null>(null);

  const selectedNode = nodes ? nodes.find(node => node.id === selectedNodeId) : null;

  const ref = useRef<HTMLDivElement | null>(null);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onContextMenu = useCallback(
    (event: React.MouseEvent) => {
      if (!ref.current) return;
      // Prevent native context menu from showing

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        top: event.clientY < pane.height - 200 ? event.clientY : undefined,
        left: event.clientX < pane.width - 200 ? event.clientX - 80 : undefined,
        right: event.clientX >= pane.width - 200 ? pane.width - event.clientX : undefined,
        bottom: event.clientY >= pane.height - 200 ? pane.height - event.clientY : undefined,
      });
    },
    [setMenu]
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onCloseMenu = useCallback(() => setMenu(null), [setMenu]);

  const onPaneClick = () => {
    setSelectedNodeId(null);
    onCloseMenu();
  };

  const onNewNode: OnNewNodeProps = useCallback(
    (type, position, data) => {
      // if (!rfInstance) return;
      position = position || { x: 0, y: 0 };

      const newNode = {
        id: `${nodes.length + 1}`,
        type: type,
        position,
        data: {
          label: `${capitalizeFirstLetter(type.split('-').join(' '))} ${nodes.filter(node => node.type === type).length + 1}`,
          ...data,
        },
      };

      setNodes(nds => [...nds, newNode]);
    },
    [nodes]
  );

  const onNodesChange: OnNodesChange = useCallback(
    changes => {
      setNodes(nds =>
        applyNodeChanges(
          mode === Mode.CONTROL ? changes.filter(change => change.type !== 'position') : changes,
          nds
        )
      );
    },
    [setNodes, mode]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    changes => setEdges(eds => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    connection => setEdges(eds => addEdge(connection, eds)),
    [setEdges]
  );

  const onViewportChange = useCallback(
    (viewport: Viewport) => {
      setViewport(viewport);
    },
    [setViewport]
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      downloadObj(flow, 'flow.json');
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'application/json';

      fileInput.onchange = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (!target || !target.files) return;

        const file = target.files[0];
        if (!file) return;

        const text = await file.text();
        const flow = JSON.parse(text);

        if (flow) {
          const { x = 0, y = 0, zoom = 1 } = flow.viewport || {};
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          setViewport({ x, y, zoom });
        }
      };

      fileInput.click();
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  useEffect(() => {
    setNodes(nds =>
      nds.map(node => {
        return {
          ...node,
          data: {
            ...node.data,
          },
        };
      })
    );
  }, [edges]);

  return {
    nodes,
    edges,
    rfInstance,
    setNodes,
    setEdges,
    setRfInstance,
    onPaneClick,
    onNodesChange,
    onEdgesChange,
    onViewportChange,
    viewport,
    onConnect,
    onSave,
    onRestore,
    onContextMenu,
    onNodeClick,
    selectedNode,
    selectedNodeId,
    menu,
    onCloseMenu,
    onNewNode,
    ref,
    setViewport,
  };
};

export default useReactFlow;
