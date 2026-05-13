import { useState, useEffect } from "react";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import "../styles/recommendationpanel.css";

const recommendations = [
  {
    id: 1,
    text: "New Governance Standard: HashiCorp's ISO/IEC 27001:2013 Annex A pre-written policy set is now available for AWS Providers",
    docLink: "https://registry.terraform.io/...",
    browseLink: "https://www.hashicorp.com/..."
  },
  {
    id: 2,
    text: "Optimization Alert: 15% of your AWS S3 buckets are currently public. Consider applying the S3-Public-Access-Block policy.",
    docLink: "#",
    browseLink: "#"
  },
  {
    id: 3,
    text: "Security Update: New OPA rules for Kubernetes egress traffic have been released. Update your policy sets to version 2.1.",
    docLink: "#",
    browseLink: "#"
  }
];

export default function RecommendationPanel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recommendations.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeRec = recommendations[currentIndex];

  return (
    <div className="recommendation-container">
      <AutoAwesomeIcon className="recommendation-icon" />

      <div className="recommendation-content-row">
        <p className="recommendation-title">
          {activeRec.text}
        </p>
        
        <div className="recommendation-links-group">
          <span className="recommendation-separator">|</span>
          <a href={activeRec.docLink} target="_blank" rel="noopener noreferrer" className="recommendation-link">
            Explore the Documentation
          </a>
          <span className="recommendation-separator">|</span>
          <a href={activeRec.browseLink} target="_blank" rel="noopener noreferrer" className="recommendation-link">
            Browse Policy-as-a-Code
          </a>
        </div>
      </div>

      {/* --- CAROUSEL DOTS --- */}
      <div className="carousel-dots">
        {recommendations.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}