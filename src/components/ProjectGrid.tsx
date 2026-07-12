import { useState } from "react";
import ProjectCard from "./ProjectCard";
import type { Project } from "../data/projects";

interface Props {
  projects: Project[];
}

export default function ProjectGrid({ projects }: Props) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));

  const filteredProjects = selectedTag
    ? projects.filter((p) => p.tags.includes(selectedTag))
    : projects;

  return (
    <div>
      <div className="tag-row">
        <button
          type="button"
          className={selectedTag === null ? "tag-chip tag-chip-active" : "tag-chip"}
          onClick={() => setSelectedTag(null)}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={selectedTag === tag ? "tag-chip tag-chip-active" : "tag-chip"}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="project-grid">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
