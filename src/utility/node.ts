import { ButtonNode, LabelNode } from '@/components/react-flow/nodes';
import { ENodeTypes } from '@/interfaces/node';
import { NodeTypes } from '@xyflow/react';

export const nodeTypes: NodeTypes = {
  [ENodeTypes['button']]: ButtonNode,
  [ENodeTypes['label']]: LabelNode,
};
