import type { HierarchyNode } from "../interfaces/hierrarchy";

// This is your "Dry Data"
const MOCK_HIERARCHY: HierarchyNode[] = [
  {
    id: "org-1",
    name: "Engineering Org",
    type: "organization",
    children: [
      {
        id: "proj-1",
        name: "Payments Project",
        type: "project",
        children: [
          { id: "ws-1", name: "Workspace-A", type: "workspace" },
          { id: "ws-2", name: "Workspace-B", type: "workspace" }
        ]
      },
      {
        id: "proj-2",
        name: "Infra Project",
        type: "project",
        children: [
          { id: "stack-1", name: "Stack-X", type: "stack" },
          { id: "stack-2", name: "Stack-Y", type: "stack" }
        ]
      }
    ]
  },
  {
    id: "org-2",
    name: "Security Org",
    type: "organization",
    children: [
      {
        id: "proj-3",
        name: "Compliance Project",
        type: "project",
        children: [
          { id: "ws-3", name: "Workspace-C", type: "workspace" }
        ]
      }
    ]
  }
];

/**
 * Service to fetch the organization hierarchy.
 * Currently uses mock data, but ready for API integration.
 */
export const fetchHierarchy = async (): Promise<HierarchyNode[]> => {
  // Simulate network delay for a more realistic "dry run"
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_HIERARCHY), 300);
  });
};