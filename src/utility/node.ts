import { ButtonNode, ButtonProperties, LabelNode } from '@/components/react-flow/nodes';
import { ENodeTypes } from '@/interfaces/node';
import { ChannelType } from '@/interfaces/template';
import { NodeTypes } from '@xyflow/react';

export const nodeTypes: NodeTypes = {
  [ENodeTypes['button']]: ButtonNode,
  [ENodeTypes['label']]: LabelNode,
};

export const getNodeProperties = (type: ENodeTypes) => {
  if (type === ENodeTypes.button) {
    return ButtonProperties;
  }
};

export const nodeTypeToChannelType = (type: ENodeTypes) => {
  if (type === ENodeTypes.button) {
    return ChannelType.BOOLEAN;
  }

  return ChannelType.STRING;
};
