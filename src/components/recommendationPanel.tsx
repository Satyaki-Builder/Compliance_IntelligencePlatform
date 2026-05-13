import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import "../styles/recommendationpanel.css";

export default function RecommendationPanel() {
  return (
    <div className="recommendation-container">
      <AutoAwesomeIcon className="recommendation-icon" />

      <div className="recommendation-content-row">
        <p className="recommendation-title">
          New Governance Standard: HashiCorp's ISO/IEC 27001:2013 Annex A pre-written policy set is now available for AWS Providers
        </p>
        
        <div className="recommendation-links-group">
          <span className="recommendation-separator">|</span>
          <a 
            href="https://registry.terraform.io/policies/hashicorp/iso-iec-27001-2013-annex-a-policy-set-for-aws-terraform/1.0.0/policy/iam-managed-policy-should-be-attached-to-role"
            target="_blank" 
            rel="noopener noreferrer" 
            className="recommendation-link"
          >
            Explore the Documentation
          </a>
          <span className="recommendation-separator">|</span>
          <a 
            href="https://www.hashicorp.com/en/blog/policy-as-code-explained" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="recommendation-link"
          >
            Browse Policy-as-a-Code
          </a>
        </div>
      </div>
    </div>
  );
}