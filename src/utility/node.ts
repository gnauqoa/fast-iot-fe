import { ButtonNode, ButtonProperties, LabelNode, SliderNode } from '@/components/react-flow/nodes';
import { LabelProperties } from '@/components/react-flow/nodes/label/properties';
import { SliderProperties } from '@/components/react-flow/nodes/slider/properties';
import { ENodeTypes } from '@/interfaces/node';
import { ChannelType } from '@/interfaces/template';
import { NodeTypes } from '@xyflow/react';

export const nodeTypes: NodeTypes = {
  [ENodeTypes['button']]: ButtonNode,
  [ENodeTypes['label']]: LabelNode,
  [ENodeTypes['slider']]: SliderNode,
};

export const getNodeProperties = (type: ENodeTypes) => {
  if (type === ENodeTypes.button) {
    return ButtonProperties;
  }

  if (type === ENodeTypes.label) {
    return LabelProperties;
  }

  if (type === ENodeTypes.slider) {
    return SliderProperties;
  }
};

export const nodeTypeToChannelType = (type: ENodeTypes) => {
  if (type === ENodeTypes.button) {
    return ChannelType.BOOLEAN;
  }

  if (type === ENodeTypes.label) {
    return ChannelType.STRING;
  }

  if (type === ENodeTypes.slider) {
    return ChannelType.NUMBER;
  }

  return ChannelType.STRING;
};
