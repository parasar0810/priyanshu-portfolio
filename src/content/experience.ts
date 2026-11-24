/**
 * Experience — copied from the résumé (Nov 2026 revision). Do not add numbers
 * that are not on the résumé.
 */
export type Role = {
  company: string;
  title: string;
  period: string;
  start: string; // ISO month, for <time>
  current?: boolean;
  summary: string;
  highlights: string[];
  stack: string[];
};

export const experience: Role[] = [
  {
    company: "iSON Technologies",
    title: "AI & Automation Engineer Intern",
    period: "May 2025 — Present",
    start: "2025-05",
    current: true,
    summary:
      "Root-cause analysis and end-to-end validation of an AI ticket-routing model (ServiceNow incident auto-categorisation) for a telecom client.",
    highlights: [
      "Validated the routing model on a 2,273-ticket holdout spanning a five-week live traffic window.",
      "Traced a low automation ceiling to label contamination from a routing migration and a mislabeled catch-all queue (73% of tickets in one class were mislabeled), and wrote a three-phase remediation roadmap: data-quality fixes, CMDB feature integration and dynamic thresholding.",
      "Refactored diagnostic ML scripts into a production-style inference service with train/inference separation and joblib model serialisation — inference went from ~45–90 seconds to ~4.5 ms per ticket.",
      "Moved hard-coded business rules (confidence thresholds, regex patterns, class blocklists) into a standalone config so non-engineers can tune routing without a redeploy.",
      "Added per-class confidence thresholds on high-confusion categories, reducing the dangerous-misrouting rate from 1.10% to 0.35% while holding 89.66% overall accuracy on the validation set.",
    ],
    stack: ["Python", "scikit-learn", "joblib", "ServiceNow data", "Evaluation design"],
  },
  {
    company: "Tata Technologies",
    title: "AI & ML Intern",
    period: "Jun 2025 — Aug 2025",
    start: "2025-06",
    summary:
      "Traffic-sign detection for an ADAS pipeline, from dataset preparation through a served inference API.",
    highlights: [
      "Built a CNN traffic-sign detector in Keras/TensorFlow reaching 95%+ accuracy, integrated into an ADAS pipeline for real-time inference.",
      "Applied augmentation and class balancing across 43+ labelled categories; compared ResNet with a custom CNN using F1, confusion matrices and precision–recall curves.",
      "Served the model through a Flask REST API with precision–recall-tuned thresholds for downstream ADAS integration.",
      "Owned dataset preparation end to end: annotation review, train/test splits and iterative error analysis.",
    ],
    stack: ["TensorFlow", "Keras", "CNNs", "Flask", "Error analysis"],
  },
  {
    company: "Tata Motors",
    title: "Full Stack Developer Intern",
    period: "Dec 2024 — Jan 2025",
    start: "2024-12",
    summary: "An internal ticket-management system with authentication, role-based access and live status updates.",
    highlights: [
      "Built the system with Node.js, React and MySQL, using JWT authentication, RBAC and real-time status updates over REST APIs.",
      "Designed indexed MySQL schemas with ACID transactional consistency; introduced structured logging and a modular service layer.",
    ],
    stack: ["Node.js", "React", "MySQL", "JWT", "RBAC"],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "SQL", "C++", "Bash"] },
  { group: "Backend", items: ["FastAPI", "Node.js", "Express", "Flask", "REST", "JWT / RBAC"] },
  {
    group: "Applied AI",
    items: ["LLM agents", "Google ADK", "CrewAI", "MCP", "RAG", "Vector search", "PyTorch", "TensorFlow"],
  },
  { group: "Data", items: ["PostgreSQL", "MySQL", "Redis", "pgvector", "Indexing", "Transactions"] },
  {
    group: "Infra & observability",
    items: ["Docker", "AWS EC2", "Prometheus", "Alertmanager", "Grafana", "GitHub Actions", "Linux"],
  },
];
