export type Domain = 'DS&A' | 'Gang of Four' | 'ML & AI';

export type VisualizationType = 'graph' | 'bars' | 'timeline' | 'scatter' | 'flow';

export interface GraphNode {
  id: string;
  layer: number;
}

export interface GraphVisualization {
  type: 'graph';
  title: string;
  summary: string;
  nodes: GraphNode[];
  order: string[];
}

export interface BarsVisualization {
  type: 'bars';
  title: string;
  summary: string;
  values: number[];
  steps: string[];
}

export interface TimelineVisualization {
  type: 'timeline';
  title: string;
  summary: string;
  stages: string[];
}

export interface ScatterPoint {
  label: string;
  category: string;
  x: number;
  y: number;
}

export interface ScatterVisualization {
  type: 'scatter';
  title: string;
  summary: string;
  points: ScatterPoint[];
}

export interface FlowStage {
  title: string;
  detail: string;
}

export interface FlowVisualization {
  type: 'flow';
  title: string;
  summary: string;
  stages: FlowStage[];
}

export interface InteractiveVisualization {
  type: 'interactive';
  component: string;
  title: string;
  summary: string;
}

export type Visualization =
  | GraphVisualization
  | BarsVisualization
  | TimelineVisualization
  | ScatterVisualization
  | FlowVisualization
  | InteractiveVisualization;

export interface CatalogItem {
  name: string;
  slug: string;
  domain: Domain;
  category?: string;
  complexity?: string;
  type?: string;
  idea?: string;
  intent?: string;
  explanation?: string;
  visualization?: Visualization;
}
