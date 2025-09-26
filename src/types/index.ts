export interface CustomNode {
  id: string;
  type: 'circle' | 'rectangle' | 'diamond';
  position: { x: number; y: number };
  data: {
    label: string;
    color: string;
    backgroundColor: string;
    borderColor: string;
    fontSize: number;
    fontWeight: string;
    borderWidth: number;
    width?: number;
    height?: number;
  };
}

export interface CustomEdge {
  id: string;
  source: string;
  target: string;
  type: 'straight' | 'curved';
  style?: {
    stroke: string;
    strokeWidth: number;
    strokeDasharray?: string;
  };
  markerEnd: {
    type: string;
    color: string;
  };
}

export interface AppState {
  nodes: CustomNode[];
  edges: CustomEdge[];
  selectedNode: CustomNode | null;
  selectedEdge: CustomEdge | null;
  theme: 'light' | 'dark';
  snapToGrid: boolean;
  history: Array<{
    nodes: CustomNode[];
    edges: CustomEdge[];
  }>;
  historyIndex: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  nodes: CustomNode[];
  edges: CustomEdge[];
}