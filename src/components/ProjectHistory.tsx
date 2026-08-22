import React, { useState } from "react";
import {
  History,
  Search,
  Filter,
  Trash2,
  Edit3,
  Eye,
  Download,
  PlusCircle,
  Clock,
  Award,
  Layers,
  CheckCircle2,
  Cpu,
  Milestone,
} from "lucide-react";
import { ProjectIdea } from "../types/index.js";

interface ProjectHistoryProps {
  projects: ProjectIdea[];
  onSelectProject: (project: ProjectIdea) => void;
  onEditProject: (project: ProjectIdea) => void;
  onDeleteProject: (projectId: string) => void;
  onNewProject: () => void;
}

export const ProjectHistory: React.FC<ProjectHistoryProps> = ({
  projects,
  onSelectProject,
  onEditProject,
  onDeleteProject,
  onNewProject,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Extract unique domains
  const domains = ["All", ...Array.from(new Set(projects.map((p) => p.domain).filter(Boolean)))];

  const filteredProjects = projects.filter((p) => {
    // Search
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologiesRequired.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    // Domain
    const matchesDomain = selectedDomain === "All" || p.domain === selectedDomain;

    // Difficulty
    let matchesDifficulty = true;
    if (selectedDifficulty === "Beginner") matchesDifficulty = p.difficultyScore <= 4;
    else if (selectedDifficulty === "Intermediate")
      matchesDifficulty = p.difficultyScore >= 5 && p.difficultyScore <= 6;
    else if (selectedDifficulty === "Advanced")
      matchesDifficulty = p.difficultyScore >= 7 && p.difficultyScore <= 8;
    else if (selectedDifficulty === "Expert") matchesDifficulty = p.difficultyScore >= 9;

    return matchesSearch && matchesDomain && matchesDifficulty;
  });

  const exportAllJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ai-innovation-lab-projects-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-xs font-semibold text-indigo-300">
            <History className="w-3.5 h-3.5" />
            <span>SQLite Innovation Catalog</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Project Archive & Catalog
          </h1>
          <p className="text-sm text-slate-300">
            Browse, search, edit, and export your repository of AI, IoT, Blockchain, and Full-Stack project blueprints.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={exportAllJSON}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Catalog (JSON)</span>
          </button>
          <button
            onClick={onNewProject}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Project Idea</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, algorithm, or tech..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Domain Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {domains.map((dom) => (
                <option key={dom} value={dom}>
                  Domain: {dom}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">Difficulty: All Levels</option>
              <option value="Beginner">Beginner (1-4 / 10)</option>
              <option value="Intermediate">Intermediate (5-6 / 10)</option>
              <option value="Advanced">Advanced (7-8 / 10)</option>
              <option value="Expert">Expert (9-10 / 10)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
          <span>Showing {filteredProjects.length} of {projects.length} recorded blueprints</span>
          {(searchQuery || selectedDomain !== "All" || selectedDifficulty !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDomain("All");
                setSelectedDifficulty("All");
              }}
              className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <History className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Matching Projects Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search filters or generate new project ideas using the ideation engine.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                {/* Domain & Badges */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-indigo-300 border border-slate-700">
                    {project.domain}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-amber-300">
                      Innov: {project.innovationScore}/10
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-cyan-300">
                      Diff: {project.difficultyScore}/10
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3
                  onClick={() => onSelectProject(project)}
                  className="text-base font-bold text-white tracking-tight hover:text-indigo-400 transition-colors cursor-pointer line-clamp-2"
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {project.problemStatement || project.description}
                </p>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1">
                  {project.technologiesRequired.slice(0, 4).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologiesRequired.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                      +{project.technologiesRequired.length - 4}
                    </span>
                  )}
                </div>

                {/* Attached metadata tags */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {project.estimatedDevelopmentTime}
                  </span>
                  {project.evaluation && (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      {project.evaluation.readinessScore}% Ready
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectProject(project)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Spec</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditProject(project)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                    title="Edit project details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {deleteConfirmId === project.id ? (
                    <div className="flex items-center gap-1 bg-rose-950 p-1 rounded-lg border border-rose-800">
                      <span className="text-[10px] text-rose-300 font-bold px-1">Delete?</span>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteProject(project.id);
                          setDeleteConfirmId(null);
                        }}
                        className="px-2 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded cursor-pointer"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(project.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
