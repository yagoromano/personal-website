import { ExternalLink } from "lucide-react";
import type { Project } from "../data/projects";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <div className="project-tags">
        {project.tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
          </span>
        ))}
      </div>
      <div className="project-links">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="project-link"
        >
          <ExternalLink size={16} />
          View on GitHub
        </a>
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}
