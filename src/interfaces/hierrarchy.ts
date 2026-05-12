export type NodeType = 'organization' | 'project' | 'workspace' | 'stack';

export interface HierarchyNode {
  id: string;
  name: string;
  type: NodeType;
  children?: HierarchyNode[];
}

export interface SelectionState {
  org: string;
  proj: string;
  entity: string;
}