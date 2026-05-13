export interface Traceability {
  run_id: string;
  environment: string;
  triggered_by: string;
}

export interface ContextTags {
  engine: string;
  type: string;
  severity: string;
  region: string;
  provider: string;
}

export interface PolicyMetadata {
  policy_set: string;
  policy_name: string;
  description: string;
  framework: string;
}

export interface Diagnostics {
  error_message: string;
  timestamp: string;
}

export interface FailureNode {
  traceability: Traceability;
  context_tags: ContextTags;
  policy_metadata: PolicyMetadata;
  diagnostics: Diagnostics;
}

export interface WorkspaceNode {
  workspace_id?: string;
  stack_id?: string;
  name: string;
  environment: string;
  failures: FailureNode[];
}

export interface ProjectNode {
  project_id: string;
  name: string;
  workspaces?: WorkspaceNode[];
  stacks?: WorkspaceNode[];
}

export interface OrganizationNode {
  organization_id: string;
  name: string;
  projects: ProjectNode[];
}

export interface HierarchyDataRoot {
  hierarchy_data: OrganizationNode[];
}