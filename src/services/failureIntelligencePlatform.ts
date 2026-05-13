import type { OrganizationNode } from "../interfaces/hierrarchyData";

// Embedded "Dry Data" mapping directly to your interface contract
const MOCK_FAILURE_INTELLIGENCE_TREE: OrganizationNode[] = [
  {
    organization_id: "org-1",
    name: "Organization - 1",
    projects: [
      {
        project_id: "proj-1",
        name: "Project - 1",
        workspaces: [
          {
            workspace_id: "ws-1",
            name: "Workspace - 1",
            environment: "Prod",
            failures: [
              {
                traceability: { run_id: "R-101", environment: "Prod", triggered_by: "VCS" },
                context_tags: { engine: "Sentinel", type: "Security", severity: "Hard-M", region: "USA", provider: "Azure" },
                policy_metadata: { policy_set: "Sentinel-AWS-1", policy_name: "restrict-s3-buckets", description: "Ensure S3 buckets are not publicly accessible", framework: "Security - CIS 1.2" },
                diagnostics: { error_message: "AWS S3 Bucket is currently deployed as public", timestamp: "2026-05-11T09:00:00Z" }
              },
              {
                traceability: { run_id: "R-102", environment: "Prod", triggered_by: "CLI" },
                context_tags: { engine: "OPA", type: "Cost", severity: "Soft-M", region: "EU", provider: "AWS" },
                policy_metadata: { policy_set: "OPA-Fin", policy_name: "restrict-expensive-instances", description: "Limit expensive instance types to approved list", framework: "Compliance - NIST" },
                diagnostics: { error_message: "Instance type p3.16xlarge is not in the approved instance list", timestamp: "2026-05-11T09:15:00Z" }
              },
              {
                traceability: { run_id: "R-103", environment: "Prod", triggered_by: "VCS" },
                context_tags: { engine: "Sentinel", type: "Networking", severity: "Hard-M", region: "USA", provider: "AWS" },
                policy_metadata: { policy_set: "Sentinel-Net-1", policy_name: "restrict-open-security-groups", description: "Deny inbound 0.0.0.0/0 on sensitive ports", framework: "Security - CIS 1.2" },
                diagnostics: { error_message: "Security group sg-0abc allows unrestricted inbound on port 22", timestamp: "2026-05-12T08:00:00Z" }
              },
              {
                traceability: { run_id: "R-104", environment: "Prod", triggered_by: "API" },
                context_tags: { engine: "TFPolicy", type: "Identity", severity: "Hard-M", region: "USA", provider: "Azure" },
                policy_metadata: { policy_set: "TFPolicy-IAM", policy_name: "restrict-iam-admin", description: "Prevent assignment of global admin roles to service accounts", framework: "Security - CIS" },
                diagnostics: { error_message: "Service account sa-prod@org1.iam assigned GlobalAdmin role", timestamp: "2026-05-12T10:30:00Z" }
              },
              {
                traceability: { run_id: "R-105", environment: "Prod", triggered_by: "VCS" },
                context_tags: { engine: "OPA", type: "Storage", severity: "Soft-M", region: "EU", provider: "AWS" },
                policy_metadata: { policy_set: "OPA-Storage-1", policy_name: "enforce-s3-encryption", description: "Ensure all S3 buckets have server-side encryption enabled", framework: "Compliance - NIST" },
                diagnostics: { error_message: "Encryption configuration missing on bucket prod-assets-bucket", timestamp: "2026-05-13T09:00:00Z" }
              }
            ]
          },
          {
            workspace_id: "ws-2",
            name: "Workspace - 2",
            environment: "UAT",
            failures: [
              {
                traceability: { run_id: "R-106", environment: "UAT", triggered_by: "API" },
                context_tags: { engine: "Sentinel", type: "Security", severity: "Hard-M", region: "USA", provider: "Azure" },
                policy_metadata: { policy_set: "Sentinel-AWS-1", policy_name: "restrict-s3-buckets", description: "Ensure S3 buckets are not publicly accessible", framework: "Security - CIS 1.2" },
                diagnostics: { error_message: "AWS S3 Bucket uat-media-store is deployed as public", timestamp: "2026-05-11T10:00:00Z" }
              },
              {
                traceability: { run_id: "R-107", environment: "UAT", triggered_by: "CLI" },
                context_tags: { engine: "TFPolicy", type: "Best-Practices", severity: "Advisory", region: "APAC", provider: "GCP" },
                policy_metadata: { policy_set: "TFPolicy-BP", policy_name: "enforce-resource-tagging", description: "All resources must have mandatory tags: Owner, CostCenter, Environment", framework: "Best Practices - CIS" },
                diagnostics: { error_message: "Resource gke-cluster-uat missing required tag: CostCenter", timestamp: "2026-05-12T11:00:00Z" }
              },
              {
                traceability: { run_id: "R-108", environment: "UAT", triggered_by: "VCS" },
                context_tags: { engine: "OPA", type: "Networking", severity: "Soft-M", region: "EU", provider: "AWS" },
                policy_metadata: { policy_set: "OPA-Net-1", policy_name: "restrict-public-ip", description: "Deny resources with directly assigned public IPs", framework: "Governance - NIST" },
                diagnostics: { error_message: "EC2 instance i-0xfe981 has a directly assigned public IP address", timestamp: "2026-05-13T08:45:00Z" }
              }
            ]
          },
          {
            workspace_id: "ws-3",
            name: "Workspace - 3",
            environment: "Dev",
            failures: [
              {
                traceability: { run_id: "R-109", environment: "Dev", triggered_by: "CLI" },
                context_tags: { engine: "Sentinel", type: "Cost", severity: "Soft-M", region: "USA", provider: "AWS" },
                policy_metadata: { policy_set: "Sentinel-Cost-1", policy_name: "restrict-oversized-instances", description: "Block provisioning of instances above approved size tier in Dev", framework: "Compliance - NIST" },
                diagnostics: { error_message: "Instance m5.24xlarge exceeds approved Dev tier limit of m5.xlarge", timestamp: "2026-05-11T14:00:00Z" }
              },
              {
                traceability: { run_id: "R-110", environment: "Dev", triggered_by: "API" },
                context_tags: { engine: "OPA", type: "Identity", severity: "Hard-M", region: "APAC", provider: "GCP" },
                policy_metadata: { policy_set: "OPA-IAM-1", policy_name: "restrict-service-account-keys", description: "Prevent creation of long-lived service account keys", framework: "Security - CIS" },
                diagnostics: { error_message: "Service account key created with expiry > 90 days on sa-dev-runner", timestamp: "2026-05-12T15:30:00Z" }
              }
            ]
          },
          {
            workspace_id: "ws-4",
            name: "Workspace - 4",
            environment: "QA",
            failures: [
              {
                traceability: { run_id: "R-111", environment: "QA", triggered_by: "VCS" },
                context_tags: { engine: "TFPolicy", type: "Storage", severity: "Hard-M", region: "MENA", provider: "Oracle Cloud" },
                policy_metadata: { policy_set: "TFPolicy-Storage", policy_name: "enforce-bucket-versioning", description: "All production and QA storage buckets must have versioning enabled", framework: "Compliance - NIST" },
                diagnostics: { error_message: "Object storage bucket qa-artifact-store has versioning disabled", timestamp: "2026-05-11T16:00:00Z" }
              },
              {
                traceability: { run_id: "R-112", environment: "QA", triggered_by: "CLI" },
                context_tags: { engine: "Sentinel", type: "Security", severity: "Hard-M", region: "MENA", provider: "Oracle Cloud" },
                policy_metadata: { policy_set: "Sentinel-Sec-2", policy_name: "restrict-root-account-usage", description: "Root account must not be used for day-to-day operations", framework: "Security - CIS 1.2" },
                diagnostics: { error_message: "Root account login detected from IP 185.220.101.45 at 2026-05-11T15:55Z", timestamp: "2026-05-11T16:10:00Z" }
              },
              {
                traceability: { run_id: "R-113", environment: "QA", triggered_by: "API" },
                context_tags: { engine: "OPA", type: "Best-Practices", severity: "Advisory", region: "MENA", provider: "AWS" },
                policy_metadata: { policy_set: "OPA-BP-1", policy_name: "enforce-lifecycle-policy", description: "All S3 buckets must have a lifecycle policy defined", framework: "Best Practices - CIS" },
                diagnostics: { error_message: "S3 bucket qa-logs-archive has no lifecycle policy configured", timestamp: "2026-05-13T07:30:00Z" }
              }
            ]
          },
          {
            workspace_id: "ws-5",
            name: "Workspace - 5",
            environment: "Prod",
            failures: [
              {
                traceability: { run_id: "R-114", environment: "Prod", triggered_by: "VCS" },
                context_tags: { engine: "Sentinel", type: "Compute", severity: "Soft-M", region: "LATAM", provider: "AWS" },
                policy_metadata: { policy_set: "Sentinel-Compute-1", policy_name: "restrict-unencrypted-volumes", description: "All EBS volumes must be encrypted at rest", framework: "Compliance - NIST" },
                diagnostics: { error_message: "EBS volume vol-0xab123 attached to prod-worker-3 is unencrypted", timestamp: "2026-05-11T18:00:00Z" }
              },
              {
                traceability: { run_id: "R-115", environment: "Prod", triggered_by: "CLI" },
                context_tags: { engine: "TFPolicy", type: "Networking", severity: "Hard-M", region: "LATAM", provider: "AWS" },
                policy_metadata: { policy_set: "TFPolicy-Net", policy_name: "deny-rdp-from-internet", description: "Block RDP port 3389 from 0.0.0.0/0", framework: "Security - CIS 1.2" },
                diagnostics: { error_message: "Security group sg-rdp-open allows TCP 3389 from 0.0.0.0/0", timestamp: "2026-05-12T09:00:00Z" }
              },
              {
                traceability: { run_id: "R-116", environment: "Prod", triggered_by: "API" },
                context_tags: { engine: "OPA", type: "Identity", severity: "Hard-M", region: "LATAM", provider: "Azure" },
                policy_metadata: { policy_set: "OPA-IAM-2", policy_name: "enforce-mfa-on-privileged-accounts", description: "All accounts with elevated privileges must have MFA enabled", framework: "Security - CIS" },
                diagnostics: { error_message: "User admin-latam@org1.com has Contributor role but MFA is disabled", timestamp: "2026-05-13T10:00:00Z" }
              }
            ]
          }
        ],
        stacks: []
      },
      {
        project_id: "proj-2",
        name: "Project - 2",
        workspaces: [],
        stacks: [
          {
            stack_id: "stk-1",
            name: "Stack - 1",
            environment: "Prod",
            failures: [
              {
                traceability: { run_id: "R-201", environment: "Prod", triggered_by: "VCS" },
                context_tags: { engine: "TFPolicy", type: "Identity", severity: "Advisory", region: "APAC", provider: "GCP" },
                policy_metadata: { policy_set: "TFPolicy-IAM", policy_name: "restrict-iam-admin", description: "Limit IAM admin roles to approved accounts only", framework: "Security - CIS" },
                diagnostics: { error_message: "User assigned global admin role without approval ticket reference", timestamp: "2026-05-11T11:00:00Z" }
              },
              {
                traceability: { run_id: "R-202", environment: "Prod", triggered_by: "CLI" },
                context_tags: { engine: "Sentinel", type: "Security", severity: "Hard-M", region: "APAC", provider: "GCP" },
                policy_metadata: { policy_set: "Sentinel-GCP-1", policy_name: "restrict-public-gcs-buckets", description: "GCS buckets must not be publicly readable", framework: "Security - CIS 1.2" },
                diagnostics: { error_message: "GCS bucket stk1-prod-assets has allUsers read access enabled", timestamp: "2026-05-12T13:00:00Z" }
              },
              {
                traceability: { run_id: "R-203", environment: "Prod", triggered_by: "API" },
                context_tags: { engine: "OPA", type: "Cost", severity: "Soft-M", region: "APAC", provider: "GCP" },
                policy_metadata: { policy_set: "OPA-Cost-GCP", policy_name: "restrict-gpu-instances", description: "GPU instances require explicit approval tag before provisioning", framework: "Compliance - NIST" },
                diagnostics: { error_message: "VM instance ml-training-node-1 uses n1-standard-96 GPU without approval tag", timestamp: "2026-05-13T09:30:00Z" }
              }
            ]
          },
          {
            stack_id: "stk-2",
            name: "Stack - 2",
            environment: "UAT",
            failures: [
              {
                traceability: { run_id: "R-204", environment: "UAT", triggered_by: "VCS" },
                context_tags: { engine: "OPA", type: "Networking", severity: "Soft-M", region: "EU", provider: "Azure" },
                policy_metadata: { policy_set: "OPA-Net-Azure", policy_name: "restrict-vnet-open-ports", description: "Azure VNet NSGs must not allow all inbound traffic", framework: "Governance - NIST" },
                diagnostics: { error_message: "NSG nsg-uat-web allows inbound * on port range 0-65535", timestamp: "2026-05-11T12:00:00Z" }
              },
              {
                traceability: { run_id: "R-205", environment: "UAT", triggered_by: "API" },
                context_tags: { engine: "TFPolicy", type: "Storage", severity: "Hard-M", region: "EU", provider: "Azure" },
                policy_metadata: { policy_set: "TFPolicy-Azure-Storage", policy_name: "enforce-blob-private-access", description: "Azure Blob containers must have private access level only", framework: "Compliance - NIST" },
                diagnostics: { error_message: "Blob container uat-reports has access level set to Blob (public read)", timestamp: "2026-05-12T14:00:00Z" }
              }
            ]
          }
        ]
      },
      {
        project_id: "proj-3",
        name: "Project - 3",
        workspaces: [
          {
            workspace_id: "ws-6",
            name: "Workspace - 6",
            environment: "Prod",
            failures: [
              {
                traceability: { run_id: "R-301", environment: "Prod", triggered_by: "VCS" },
                context_tags: { engine: "Sentinel", type: "Storage", severity: "Hard-M", region: "EU", provider: "Azure" },
                policy_metadata: { policy_set: "Sentinel-Azure-Storage", policy_name: "enforce-storage-https-only", description: "Azure Storage Accounts must enforce HTTPS-only traffic", framework: "Security - CIS 1.2" },
                diagnostics: { error_message: "Storage account stgprod6eu01 has HTTPS-only traffic disabled", timestamp: "2026-05-11T08:00:00Z" }
              }
            ]
          }
        ],
        stacks: []
      }
    ]
  },
  {
    organization_id: "org-2",
    name: "Organization - 2",
    projects: [
      {
        project_id: "proj-6",
        name: "Project - 6",
        workspaces: [
          {
            workspace_id: "ws-9",
            name: "Workspace - 9",
            environment: "Prod",
            failures: [
              {
                traceability: { run_id: "R-601", environment: "Prod", triggered_by: "VCS" },
                context_tags: { engine: "Sentinel", type: "Security", severity: "Hard-M", region: "EU", provider: "Azure" },
                policy_metadata: { policy_set: "Sentinel-Azure-2", policy_name: "enforce-defender-for-cloud", description: "Microsoft Defender for Cloud must be enabled on all production subscriptions", framework: "Security - CIS 1.2" },
                diagnostics: { error_message: "Defender for Cloud plan is set to Free tier on subscription prod-eu-org2", timestamp: "2026-05-11T09:00:00Z" }
              }
            ]
          }
        ],
        stacks: []
      }
    ]
  },
  {
    organization_id: "org-3",
    name: "Organization - 3",
    projects: [
      {
        project_id: "proj-8",
        name: "Project - 8",
        workspaces: [
          {
            workspace_id: "ws-11",
            name: "Workspace - 11",
            environment: "Prod",
            failures: [
              {
                traceability: { run_id: "R-801", environment: "Prod", triggered_by: "VCS" },
                context_tags: { engine: "Sentinel", type: "Security", severity: "Hard-M", region: "USA", provider: "AWS" },
                policy_metadata: { policy_set: "Sentinel-AWS-3", policy_name: "enforce-secrets-manager", description: "Application secrets must be stored in AWS Secrets Manager, not environment variables", framework: "Security - CIS 1.2" },
                diagnostics: { error_message: "Lambda function prod-payment-processor has DB_PASSWORD set as plaintext env variable", timestamp: "2026-05-11T07:00:00Z" }
              }
            ]
          }
        ],
        stacks: []
      }
    ]
  }
];

/**
 * Service to fetch the multi-level organization hierarchy along with 
 * nested policy failure forensics.
 * Currently uses embedded static data; structured for seamless DB/API transport.
 */
export const fetchFailureIntelligenceTree = async (): Promise<OrganizationNode[]> => {
  // Simulate network delay to verify frontend loading spinners seamlessly
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_FAILURE_INTELLIGENCE_TREE), 300);
  });
};