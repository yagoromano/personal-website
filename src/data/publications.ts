export interface Publication {
  title: string;
  venue: string;
  year: number;
  authors: string[];
  summary: string;
  arxivUrl: string;
  contribution: string;
  projectSlug?: string;
}

// The author name to emphasize when rendering author lists.
export const AUTHOR_NAME = "Yago Romano Martinez";

export const PUBLICATIONS: Publication[] = [
  {
    title: "LLMs as Agentic Cooperative Players in Multiplayer UNO",
    venue: "IEEE International Conference on Machine Learning and Applications (ICMLA)",
    year: 2025,
    authors: ["Yago Romano Martinez", "Jesse Roberts"],
    summary:
      "Evaluated decoder-only LLMs from 1B to 70B parameters as agentic UNO players across up to 10,000 distributed games per configuration. Every model beat a random baseline in solo play, but only the 70B model gave a teammate statistically significant help, showing that solo competence does not imply cooperative skill.",
    arxivUrl: "https://arxiv.org/abs/2509.09867",
    contribution: "First author",
    projectSlug: "llm-uno",
  },
  {
    title: "Mitigation of Camouflaged Adversarial Attacks in Autonomous Vehicles: A Case Study Using CARLA Simulator",
    venue: "IEEE International Symposium on Circuits and Systems (ISCAS)",
    year: 2025,
    authors: [
      "Yago Romano Martinez",
      "Carter Brady",
      "Abhijeet Solanki",
      "Wesam Al Amiri",
      "Syed Rafay Hasan",
      "Terry N. Guo",
    ],
    summary:
      "Developed camera-camouflaged adversarial attacks that re-texture a stop sign to delay an autonomous vehicle's auto-braking in CARLA, then two defenses, distance-aware braking and side-camera sensor fusion, that restore safe stopping across varied conditions.",
    arxivUrl: "https://arxiv.org/abs/2502.05208",
    contribution: "First author",
    projectSlug: "carla-adversarial-braking",
  },
  {
    title:
      "Supply Chain Exploitation of Secure ROS 2 Systems: A Proof-of-Concept on Autonomous Platform Compromise via Keystore Exfiltration",
    venue: "IEEE Military Communications Conference (MILCOM)",
    year: 2025,
    authors: [
      "Tahmid Hasan Sakib",
      "Yago Romano Martinez",
      "Carter Brady",
      "Syed Rafay Hasan",
      "Terry N. Guo",
    ],
    summary:
      "A proof-of-concept supply chain attack that trojanizes a Secure ROS 2 package to exfiltrate keystore credentials over DNS, then rejoins the secure network as an authenticated node to spoof control and perception on a real Quanser QCar2 autonomous vehicle.",
    arxivUrl: "https://arxiv.org/abs/2511.00140",
    contribution: "Equal contribution",
    projectSlug: "supply-chain-sros2",
  },
];
