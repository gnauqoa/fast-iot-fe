import { Edge, Node, Viewport } from '@xyflow/react';

export interface ITemplate {
  id: number;
  name: string;
  description?: string;
  userId: number;
  prototype?: {
    nodes: Node[];
    edges: Edge[];
    viewport: Viewport;
  };
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
