import React, { useState } from "react";
import {
  Lightbulb,
  Sparkles,
  Plus,
  X,
  Layers,
  Clock,
  Award,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  Cpu,
  Milestone,
  Code2,
  Server,
  Database,
  Terminal,
  Activity,
} from "lucide-react";
import { ProjectIdea } from "../types/index.js";
import { api } from "../services/api.js";

const POPULAR_DOMAINS = [
  "Artificial Intelligence",
  "Machine Learning",
  "IoT & Smart Systems",
  "Blockchain & Web3",
  "Cybersecurity",
  "Healthcare & MedTech",
  "Agriculture & Agritech",
  "Education & EdTech",
  "Smart City & Mobility",
  "Web Development & Cloud",
  "Robotics & Automation",
  "FinTech & Decentralized Finance",
];

const POPULAR_TECHS = [
  "Python",
  "FastAPI",
  "TensorFlow",
  "PyTorch",
  "React",
  "Node.js",
  "Solidity",
  "ESP32",
  "OpenCV",
  "Docker",
  "PostgreSQL",
  "Redis",
  "WebSockets",
  "LangChain",
  "Flutter",
  "Go",
  "Rust",
];

interface ProjectGeneratorProps {
  onProjectsGenerated: (ideas: ProjectIdea[]) => void;
  onSelectProject: (idea: ProjectIdea) => void;
  onActionTrigger: (action: "evaluator" | "architecture" | "roadmap" | "features" | "advisor", project: ProjectIdea) => void;
  onSaveProject: (project: ProjectIdea) => void;
  savedProjectIds: string[];
}

export const ProjectGenerator: React.FC<ProjectGeneratorProps> = ({
  onProjectsGenerated,
  onSelectProject,
  onActionTrigger,
  onSaveProject,
  savedProjectIds,
}) => {
  const [domain, setDomain] = useState<string>("Artificial Intelligence");
  const [customDomain, setCustomDomain] = useState<string>("");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([
    "Python",
    "React",
    "FastAPI",
    "PyTorch",
  ]);
  const [techInput, setTechInput] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("Intermediate");
  const [duration, setDuration] = useState<string>("1-2 Months");
  const [projectScope, setProjectScope] = useState<string>("Individual");
  const [projectType, setProjectType] = useState<string>("Full-Stack AI Application");

  const [loading, setLoading] = useState<boolean>(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdea[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddTech = (tech: string) => {
    const trimmed = tech.trim();
    if (trimmed && !selectedTechs.includes(trimmed)) {
      setSelectedTechs([...selectedTechs, trimmed]);
    }
    setTechInput("");
  };

  const handleRemoveTech = (tech: string) => {
    setSelectedTechs(selectedTechs.filter((t) => t !== tech));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalDomain = customDomain.trim() || domain;
    if (!finalDomain) {
      setErrorMessage("Please select or enter a project domain.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setGeneratedIdeas([]);

    try {
      const ideas = await api.generateProjects({
        domain: finalDomain,
        technologies: selectedTechs,
        difficulty,
        duration,
        projectScope,
        projectType,
        autoSave: false,
      });

      setGeneratedIdeas(ideas);
      onProjectsGenerated(ideas);
      if (ideas.length > 0) {
        setExpandedId(ideas[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to generate project ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-xs font-semibold text-indigo-300">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Intelligent Ideation Engine</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          AI Project Idea Generator
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-3xl">
          Specify your target domain, known technologies, difficulty, and timeline. Our Gemini 3.7 engine will architect 5 innovative, practical, and fully specified project ideas complete with modules, algorithms, and architectures.
        </p>
      </div>

      {/* Input Configuration Form */}
      <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Domain Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              1. Project Domain
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_DOMAINS.map((dom) => (
                <button
                  type="button"
                  key={dom}
                  onClick={() => {
                    setDomain(dom);
                    setCustomDomain("");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    domain === dom && !customDomain
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
            <div className="pt-1">
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="Or type custom domain (e.g. Quantum Computing, Bio-informatics)..."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Known Technologies */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              2. Known / Preferred Technologies
            </label>
            <div className="flex flex-wrap gap-1.5 min-h-[42px] p-2 bg-slate-800/40 border border-slate-700 rounded-xl items-center">
              {selectedTechs.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/60 text-xs font-medium"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTech(techInput);
                  }
                }}
                placeholder="Type tech and press Enter..."
                className="flex-1 min-w-[120px] bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none px-1"
              />
            </div>

            {/* Popular tech chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium self-center mr-1">Quick add:</span>
              {POPULAR_TECHS.slice(0, 10).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => handleAddTech(t)}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  +{t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Secondary Filters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-800">
          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              3. Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Beginner">Beginner (1-4 / 10)</option>
              <option value="Intermediate">Intermediate (5-7 / 10)</option>
              <option value="Advanced">Advanced (8-9 / 10)</option>
              <option value="Expert">Expert / Research (10 / 10)</option>
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              4. Target Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="2 Weeks">2 Weeks (Sprint MVP)</option>
              <option value="1 Month">1 Month (Core Prototype)</option>
              <option value="2-3 Months">2-3 Months (Complete Product)</option>
              <option value="6 Months">6 Months (Production & Research)</option>
            </select>
          </div>

          {/* Scope */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              5. Project Scope
            </label>
            <select
              value={projectScope}
              onChange={(e) => setProjectScope(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Individual">Individual (Solo Developer)</option>
              <option value="Small Team (2-3)">Small Team (2-3 Members)</option>
              <option value="Capstone Team (4-6)">Capstone Team (4-6 Members)</option>
            </select>
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              6. Preferred Type
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Full-Stack AI Application">Full-Stack AI Application</option>
              <option value="Edge IoT & Hardware Hub">Edge IoT & Hardware Hub</option>
              <option value="Blockchain & Smart Contracts">Blockchain & Smart Contracts</option>
              <option value="Computer Vision Pipeline">Computer Vision Pipeline</option>
              <option value="Autonomous Agent System">Autonomous Agent System</option>
              <option value="Research & Academic Paper">Research & Academic Paper</option>
            </select>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-200">
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white whitespace-nowrap shrink-0 transition-all shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Architecting 5 Project Concepts with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate 5 Unique Projects</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Results Section */}
      {generatedIdeas.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                5 Tailored Project Proposals
              </h2>
              <p className="text-xs text-slate-400">
                Click any proposal to expand full architectural and development specifications.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 border border-emerald-800/60 text-emerald-300">
              5 Ideas Ready
            </span>
          </div>

          <div className="space-y-4">
            {generatedIdeas.map((idea, index) => {
              const isExpanded = expandedId === idea.id;
              const isSaved = savedProjectIds.includes(idea.id);

              return (
                <div
                  key={idea.id}
                  className={`bg-slate-900 border transition-all rounded-2xl overflow-hidden ${
                    isExpanded ? "border-indigo-500/70 shadow-lg ring-1 ring-indigo-500/30" : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {/* Card Header Accordion Trigger */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : idea.id)}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none bg-slate-900 hover:bg-slate-850"
                  >
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-bold flex items-center justify-center">
                          #{index + 1}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-indigo-300 border border-slate-700">
                          {idea.domain}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-amber-300">
                          Innovation: {idea.innovationScore}/10
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-cyan-300">
                          Difficulty: {idea.difficultyScore}/10
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {idea.estimatedDevelopmentTime}
                        </span>
                      </div>

                      <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
                        {idea.title}
                      </h3>

                      <p className="text-xs md:text-sm text-slate-300 line-clamp-2">
                        {idea.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveProject(idea);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isSaved
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{isSaved ? "Saved" : "Save Project"}</span>
                      </button>

                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                        <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detailed Specification */}
                  {isExpanded && (
                    <div className="p-6 border-t border-slate-800 space-y-6 bg-slate-900/90">
                      {/* Problem Statement & Target Users */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-850 border border-slate-800 p-4 rounded-xl space-y-1.5">
                          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" />
                            Problem Statement
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {idea.problemStatement}
                          </p>
                        </div>

                        <div className="bg-slate-850 border border-slate-800 p-4 rounded-xl space-y-1.5">
                          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Target Users & Beneficiaries
                          </span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {idea.targetUsers.map((user, uIdx) => (
                              <span
                                key={uIdx}
                                className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-medium"
                              >
                                {user}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Objectives */}
                      <div className="bg-slate-850 border border-slate-800 p-4 rounded-xl space-y-2">
                        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          Key Objectives
                        </span>
                        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-300">
                          {idea.objectives.map((obj, oIdx) => (
                            <li key={oIdx} className="flex items-start gap-2 bg-slate-800/60 p-2 rounded-lg">
                              <span className="w-4 h-4 rounded-full bg-indigo-900 text-indigo-300 flex items-center justify-center shrink-0 text-[10px] font-bold">
                                {oIdx + 1}
                              </span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tech Stack, Hardware & DB Requirements */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-850 border border-slate-800 p-4 rounded-xl space-y-2">
                          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5" />
                            Technologies & Tools
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {idea.technologiesRequired.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-xs bg-slate-800 text-emerald-300 border border-slate-700"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                          {idea.softwareRequirements?.length > 0 && (
                            <div className="pt-2 text-[11px] text-slate-400">
                              <span className="font-semibold text-slate-300">Software: </span>
                              {idea.softwareRequirements.join(", ")}
                            </div>
                          )}
                        </div>

                        <div className="bg-slate-850 border border-slate-800 p-4 rounded-xl space-y-2">
                          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5" />
                            Hardware & Algorithms
                          </span>
                          {idea.hardwareRequirements && idea.hardwareRequirements.length > 0 ? (
                            <div className="space-y-1">
                              <p className="text-[11px] font-semibold text-slate-300">Hardware:</p>
                              <div className="flex flex-wrap gap-1">
                                {idea.hardwareRequirements.map((h, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-purple-300">
                                    {h}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">No specialized hardware required (Cloud / Web)</p>
                          )}
                          {idea.aiMlAlgorithms && idea.aiMlAlgorithms.length > 0 && (
                            <div className="pt-1 text-[11px] text-slate-300">
                              <span className="font-semibold text-purple-300">AI/ML: </span>
                              {idea.aiMlAlgorithms.join(", ")}
                            </div>
                          )}
                        </div>

                        <div className="bg-slate-850 border border-slate-800 p-4 rounded-xl space-y-2">
                          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Database className="w-3.5 h-3.5" />
                            Database & Suggested APIs
                          </span>
                          <p className="text-xs text-slate-300">
                            {idea.databaseRequirements?.join(", ") || "Relational Database (SQLite/PostgreSQL)"}
                          </p>
                          {idea.apiSuggestions?.length > 0 && (
                            <div className="space-y-1 pt-1 font-mono text-[11px] text-amber-300/90">
                              {idea.apiSuggestions.map((apiItem, aIdx) => (
                                <div key={aIdx} className="truncate bg-slate-800 px-2 py-0.5 rounded">
                                  {apiItem}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Development Modules */}
                      {idea.developmentModules?.length > 0 && (
                        <div className="bg-slate-850 border border-slate-800 p-4 rounded-xl space-y-2">
                          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Server className="w-3.5 h-3.5" />
                            Development Modules Breakdown
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {idea.developmentModules.map((mod, mIdx) => (
                              <div key={mIdx} className="p-3 bg-slate-800/80 rounded-xl space-y-1">
                                <span className="text-xs font-bold text-white block">
                                  {mod.name}
                                </span>
                                <p className="text-xs text-slate-400">
                                  {mod.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Architecture Explanation & Scalability */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-850 border border-slate-800 p-4 rounded-xl space-y-1.5">
                          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            System Architecture Overview
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {idea.systemArchitectureExplanation}
                          </p>
                        </div>

                        <div className="bg-slate-850 border border-slate-800 p-4 rounded-xl space-y-1.5">
                          <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            Future Enhancements & Scalability
                          </span>
                          <ul className="text-xs text-slate-300 space-y-1">
                            {idea.scalabilitySuggestions?.map((s, idx) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                <span>{s}</span>
                              </li>
                            ))}
                            {idea.futureEnhancements?.map((f, idx) => (
                              <li key={`f-${idx}`} className="flex items-center gap-1.5 text-slate-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action Bar Launcher */}
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-slate-400">
                          Next Project Actions:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => onActionTrigger("evaluator", idea)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Evaluate Feasibility</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onActionTrigger("features", idea)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                          >
                            <Cpu className="w-3.5 h-3.5" />
                            <span>Recommend Features</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onActionTrigger("architecture", idea)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Visual Architecture</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onActionTrigger("roadmap", idea)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"
                          >
                            <Milestone className="w-3.5 h-3.5" />
                            <span>8-Phase Roadmap</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onActionTrigger("advisor", idea)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                            <span>Tech Stack Advisor</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
