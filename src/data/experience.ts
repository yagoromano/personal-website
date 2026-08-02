export interface Role {
  company: string;
  title: string;
  location: string;
  period: string;
  current?: boolean;
  /** Short context only. Depth belongs on a linked case study or project page. */
  summary: string;
  links?: { label: string; href: string }[];
}

export const EXPERIENCE: Role[] = [
  {
    company: "HCA Healthcare",
    title: "AI Engineering Intern",
    location: "Cookeville, TN",
    period: "Jan 2026 to present",
    current: true,
    summary:
      "Building agentic AI systems end to end: a benchmark and reinforcement learning environment for evaluating multimodal VLM agents on real enterprise workflows, plus a production LLM assistant for data governance.",
    links: [
      { label: "Read the case study", href: "/projects/gui-agent-benchmark/" },
    ],
  },
  {
    company: "Tennessee Technological University",
    title: "Graduate Research Assistant",
    location: "Cookeville, TN",
    period: "May 2024 to Aug 2025",
    summary:
      "Autonomous vehicle perception and robotics security research, covering YOLOv8 and LiDAR-camera fusion in the CARLA simulator and a supply chain attack against Secure ROS 2. Produced two IEEE papers, at ISCAS 2025 and MILCOM 2025.",
    links: [
      { label: "CARLA project", href: "/projects/carla-adversarial-braking/" },
      { label: "Supply chain project", href: "/projects/supply-chain-sros2/" },
    ],
  },
  {
    company: "Tennessee Technological University",
    title: "Graduate Teaching Assistant",
    location: "Cookeville, TN",
    period: "Jan 2024 to Jul 2025",
    summary:
      "Mentored students in algorithms, machine learning, and data analysis, and designed assignments around live LLM inference and real-world API datasets.",
  },
];
