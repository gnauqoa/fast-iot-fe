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
  useReactFlow as useReactFlowHook,
} from '@xyflow/react';
import {
  Dispatch,
  DragEventHandler,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

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

// Define history state type
type HistoryState = {
  nodes: Node[];
  edges: Edge[];
};

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
    originalPos?: { x: number; y: number };
  } | null;
  onCloseMenu: () => void;
  onNewNode: OnNewNodeProps;
  ref: React.RefObject<HTMLDivElement>;
  setViewport: Dispatch<SetStateAction<Viewport>>;
  nodeDraggingType: string | null;
  setNodeDraggingType: Dispatch<SetStateAction<string | null>>;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: string) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

const useReactFlow = (): UseReactFlowReturnType => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    zoom: 1,
  });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { screenToFlowPosition } = useReactFlowHook();
  const [menu, setMenu] = useState<{
    id?: string;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    originalPos?: { x: number; y: number };
  } | null>(null);
  const [nodeDraggingType, setNodeDraggingType] = useState<string | null>(null);

  const [past, setPast] = useState<HistoryState[]>([]);
  const [future, setFuture] = useState<HistoryState[]>([]);
  const ignoringChanges = useRef(false);

  const selectedNode = nodes ? nodes.find(node => node.id === selectedNodeId) : null;

  const ref = useRef<HTMLDivElement | null>(null);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const captureCurrentState = useCallback(() => {
    return {
      nodes: [...nodes],
      edges: [...edges],
    };
  }, [nodes, edges]);

  const addToHistory = useCallback(() => {
    if (ignoringChanges.current) return;

    setPast(prevPast => [...prevPast, captureCurrentState()]);
    setFuture([]);
  }, [captureCurrentState]);

  const undo = useCallback(() => {
    if (!canUndo) return;

    const previousState = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    // Prevent this state change from being added to history
    ignoringChanges.current = true;

    // Set current state to nodes/edges from previous state
    setNodes(previousState.nodes);
    setEdges(previousState.edges);

    // Update past and future arrays
    setPast(newPast);
    setFuture(prevFuture => [captureCurrentState(), ...prevFuture]);

    // Allow changes to be added to history again
    setTimeout(() => {
      ignoringChanges.current = false;
    }, 0);
  }, [past, captureCurrentState, canUndo, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    const nextState = future[0];
    const newFuture = future.slice(1);

    // Prevent this state change from being added to history
    ignoringChanges.current = true;

    // Set current state to nodes/edges from next state
    setNodes(nextState.nodes);
    setEdges(nextState.edges);

    // Update past and future arrays
    setPast(prevPast => [...prevPast, captureCurrentState()]);
    setFuture(newFuture);

    // Allow changes to be added to history again
    setTimeout(() => {
      ignoringChanges.current = false;
    }, 0);
  }, [future, captureCurrentState, canRedo, setNodes, setEdges]);

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

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();

      // Store the exact position where user right-clicked
      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setMenu({
        top: event.clientY < pane.height - 200 ? event.clientY : undefined,
        left: event.clientX < pane.width - 200 ? event.clientX - 80 : undefined,
        right: event.clientX >= pane.width - 200 ? pane.width - event.clientX : undefined,
        bottom: event.clientY >= pane.height - 200 ? pane.height - event.clientY : undefined,
        originalPos: flowPosition,
      });
    },
    [setMenu, screenToFlowPosition]
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onCloseMenu = useCallback(() => setMenu(null), [setMenu]);

  const onPaneClick = () => {
    setSelectedNodeId(null);
    onCloseMenu();
  };

  const onNewNode: OnNewNodeProps = useCallback(
    (type, position, data) => {
      // Add to history before making changes
      addToHistory();

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
    [nodes, addToHistory]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!nodeDraggingType) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      onNewNode(nodeDraggingType, position, {});
    },
    [screenToFlowPosition, nodeDraggingType, onNewNode]
  );

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    setNodeDraggingType(nodeType);
    event.dataTransfer.setData('text/plain', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onNodesChange: OnNodesChange = useCallback(
    changes => {
      // Track significant changes to the flow for undo/redo history:
      // 1. Node removals - when user deletes a node
      // 2. Position changes - but only when the dragging ends to avoid storing intermediate states
      // 3. Selection changes are not tracked in history
      const shouldAddToHistory = changes.some(
        change =>
          // When nodes are removed
          change.type === 'remove' ||
          // When position changes and drag is complete (not during dragging)
          (change.type === 'position' && change.dragging === false && change.position)
      );

      if (shouldAddToHistory && !ignoringChanges.current) {
        addToHistory();
      }

      setNodes(nds => applyNodeChanges(changes, nds));
    },
    [setNodes, addToHistory]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    changes => {
      // Add to history for edge removals
      if (changes.some(change => change.type === 'remove') && !ignoringChanges.current) {
        addToHistory();
      }

      setEdges(eds => applyEdgeChanges(changes, eds));
    },
    [setEdges, addToHistory]
  );

  const onConnect: OnConnect = useCallback(
    connection => {
      addToHistory();
      setEdges(eds => addEdge(connection, eds));
    },
    [setEdges, addToHistory]
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
          // Clear history when restoring a saved flow
          setPast([]);
          setFuture([]);

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

  // Add keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for undo: Ctrl+Z or Command+Z (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) undo();
      }

      // Check for redo: Ctrl+Y or Ctrl+Shift+Z or Command+Shift+Z (Mac)
      if (
        ((event.ctrlKey || event.metaKey) && event.key === 'y') ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')
      ) {
        event.preventDefault();
        if (canRedo) redo();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Remove event listener on cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo, canUndo, canRedo]);

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
    nodeDraggingType,
    setNodeDraggingType,
    onDragStart,
    onDragOver,
    onDrop,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};

export default useReactFlow;
