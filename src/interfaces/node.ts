export enum ENodeTypes {
  'button' = 'button',
  'label' = 'label',
  'slider' = 'slider',
  'select' = 'select',
}

export interface NodePropertiesProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDataChange: (data: { key: string; value: any }[]) => void;
}

export interface NodePropertiesType {
  (props: NodePropertiesProps): JSX.Element;
}

export interface NodeAttribute {
  key: string;
  type: string;
  hidden?: boolean;
}
