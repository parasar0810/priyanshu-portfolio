/**
 * Experience — from the résumé (Gurugram revision, Nov 2026). Do not add
 * numbers that are not on the résumé. The résumé lists no internship
 * locations, so none are shown.
 */
export type Role = {
  company: string;
  initials: string;
  title: string;
  period: string;
  start: string; // ISO month, for <time>
  current?: boolean;
  summary: string;
  metrics: { value: string; label: string }[];
  highlights: string[];
  stack: string[];
};

export const experience: Role[] = [
  {
    company: "iSON Technologies",
    initials: "iS",
    title: "AI & Automation Engineer Intern",
    period: "May 2025 — Present",
    start: "2025-05",
    current: true,
    summary:
      "Root-cause analysis and end-to-end validation of an AI ticket-routing model (ServiceNow incident auto-categorisation) for a telecom client.",
    metrics: [
      { value: "1.10% → 0.35%", label: "dangerous misrouting" },
      { value: "~4.5 ms", label: "per ticket, from ~45–90 s" },
      { value: "89.66%", label: "accuracy held on validation" },
    ],
    highlights: [
      "Validated the routing model on a 2,273-ticket holdout spanning a five-week live traffic window.",
      "Traced a low automation ceiling to label contamination from a routing migration and a mislabeled catch-all queue (73% of tickets in one class were mislabeled), then wrote a three-phase remediation roadmap: data-quality fixes, CMDB feature integration and dynamic thresholding.",
      "Refactored diagnostic ML scripts into a production-style inference service with train/inference separation and joblib serialisation.",
      "Moved hard-coded business rules — confidence thresholds, regex patterns, class blocklists — into a standalone config so non-engineers can tune routing without a redeploy.",
      "Added per-class confidence thresholds on high-confusion categories.",
    ],
    stack: ["Python", "scikit-learn", "joblib", "Evaluation design", "Error analysis"],
  },
  {
    company: "Tata Technologies",
    initials: "TT",
    title: "AI & ML Intern",
    period: "Jun 2025 — Aug 2025",
    start: "2025-06",
    summary: "Traffic-sign detection for an ADAS pipeline, from dataset preparation to a served inference API.",
    metrics: [
      { value: "95%+", label: "detection accuracy" },
      { value: "43+", label: "labelled classes" },
    ],
    highlights: [
      "Built a CNN traffic-sign detector in Keras/TensorFlow, integrated into an ADAS pipeline for real-time inference.",
      "Applied augmentation and class balancing; compared ResNet with a custom CNN using F1, confusion matrices and precision–recall curves.",
      "Served the model through a Flask REST API with precision–recall-tuned thresholds for downstream integration.",
      "Owned dataset preparation end to end: annotation review, train/test splits and iterative error analysis.",
    ],
    stack: ["TensorFlow", "Keras", "CNNs", "Flask", "REST"],
  },
  {
    company: "Tata Motors",
    initials: "TM",
    title: "Full Stack Developer Intern",
    period: "Dec 2024 — Jan 2025",
    start: "2024-12",
    summary: "A ticket-management system with authentication, role-based access and live status updates.",
    metrics: [{ value: "JWT + RBAC", label: "auth and access control" }],
    highlights: [
      "Built the system with Node.js, React and MySQL, using JWT authentication, RBAC and real-time status updates over REST APIs.",
      "Designed indexed MySQL schemas with ACID transactional consistency; introduced structured logging and a modular service layer.",
    ],
    stack: ["Node.js", "React", "MySQL", "JWT", "RBAC"],
  },
];

/**
 * Skills — limited to what the résumé lists or a public repository demonstrates.
 * `icon` is a simple-icons slug; omitted where no legitimate icon exists.
 */
export type Skill = { name: string; icon?: string };
export const skills: { group: string; items: Skill[] }[] = [
  {
    group: "Programming languages",
    items: [
      { name: "Python", icon: "python" },
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Java", icon: "openjdk" },
      { name: "SQL" },
      { name: "C++", icon: "cplusplus" },
      { name: "Bash", icon: "gnubash" },
    ],
  },
  {
    group: "Backend engineering",
    items: [
      { name: "FastAPI", icon: "fastapi" },
      { name: "Node.js", icon: "nodedotjs" },
      { name: "Express", icon: "express" },
      { name: "Flask", icon: "flask" },
      { name: "Spring Boot", icon: "springboot" },
      { name: "REST & WebSockets" },
      { name: "JWT / RBAC", icon: "jsonwebtokens" },
      { name: "Pydantic", icon: "pydantic" },
    ],
  },
  {
    group: "Frontend development",
    items: [
      { name: "React", icon: "react" },
      { name: "HTML", icon: "html5" },
      { name: "CSS", icon: "css" },
    ],
  },
  {
    group: "AI & machine learning",
    items: [
      { name: "PyTorch", icon: "pytorch" },
      { name: "TensorFlow", icon: "tensorflow" },
      { name: "Keras", icon: "keras" },
      { name: "scikit-learn", icon: "scikitlearn" },
      { name: "Hugging Face", icon: "huggingface" },
      { name: "NumPy", icon: "numpy" },
    ],
  },
  {
    group: "LLMs, RAG & agentic AI",
    items: [
      { name: "Google ADK" },
      { name: "CrewAI" },
      { name: "LangGraph", icon: "langchain" },
      { name: "MCP" },
      { name: "A2A" },
      { name: "Gemini", icon: "googlegemini" },
      { name: "Ollama", icon: "ollama" },
      { name: "RAG & vector search" },
    ],
  },
  {
    group: "Databases",
    items: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MySQL", icon: "mysql" },
      { name: "Redis", icon: "redis" },
      { name: "pgvector" },
    ],
  },
  {
    group: "Cloud & DevOps",
    items: [
      { name: "AWS EC2 · SSM" },
      { name: "Docker", icon: "docker" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "nginx", icon: "nginx" },
      { name: "Linux", icon: "linux" },
    ],
  },
  {
    group: "Testing & observability",
    items: [
      { name: "pytest", icon: "pytest" },
      { name: "JUnit", icon: "junit5" },
      { name: "Prometheus", icon: "prometheus" },
      { name: "Grafana", icon: "grafana" },
      { name: "OpenTelemetry", icon: "opentelemetry" },
    ],
  },
  {
    group: "Developer tools",
    items: [
      { name: "Git", icon: "git" },
      { name: "Postman", icon: "postman" },
      { name: "Swagger / OpenAPI", icon: "swagger" },
    ],
  },
];
