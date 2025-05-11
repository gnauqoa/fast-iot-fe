import { ButtonNode, ButtonProperties, LabelNode } from '@/components/react-flow/nodes';
import { LabelProperties } from '@/components/react-flow/nodes/label/properties';
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

  if (type === ENodeTypes.label) {
    return LabelProperties;
  }
};

export const nodeTypeToChannelType = (type: ENodeTypes) => {
  if (type === ENodeTypes.button) {
    return ChannelType.BOOLEAN;
  }

  if (type === ENodeTypes.label) {
    return ChannelType.STRING;
  }

  return ChannelType.STRING;
};
