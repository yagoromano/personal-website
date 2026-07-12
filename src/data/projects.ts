export interface Project {
  slug: string;
  title: string;
  description: string;
  repoUrl: string;
  demoUrl?: string;
  tags: string[];
  image?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "snake-ai-dyna-q",
    title: "Snake AI (Dyna-Q)",
    description: "Classic Snake game implemented with the Dyna-Q reinforcement learning algorithm.",
    repoUrl: "https://github.com/yagoromano/snake-ai-dyna-q",
    tags: ["Python", "Reinforcement Learning"],
  },
  {
    slug: "dcgan-celeba",
    title: "DCGAN on CelebA",
    description: "Deep Convolutional GAN in TensorFlow trained on CelebA to generate realistic human face images.",
    repoUrl: "https://github.com/yagoromano/dcgan-celeba",
    tags: ["Python", "TensorFlow", "Generative Models"],
  },
  {
    slug: "carla-adversarial-braking",
    title: "CARLA Adversarial Braking",
    description: "Defense strategies for adversarial stop-sign attacks in CARLA using auto-braking.",
    repoUrl: "https://github.com/yagoromano/carla-adversarial-braking",
    tags: ["Python", "Adversarial ML", "Simulation"],
  },
  {
    slug: "llm-uno-experiments",
    title: "LLM UNO Experiments",
    description: "Experiments and evaluation scripts for the llm-uno RLCard extension.",
    repoUrl: "https://github.com/yagoromano/llm-uno-experiments",
    tags: ["Python", "LLM Evaluation", "RLCard"],
  },
  {
    slug: "llm-uno",
    title: "LLM UNO",
    description: "An RLCard extension exploring UNO gameplay driven by LLM agents.",
    repoUrl: "https://github.com/yagoromano/llm-uno",
    tags: ["Python", "RLCard", "LLM Agents"],
  },
];
