import React, { useState } from "react";
import {
  Code2,
  Sparkles,
  Server,
  Database,
  Cloud,
  Lock,
  Layers,
  Container,
  Cpu,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { TechStackRecommendation, ProjectIdea } from "../types/index.js";
import { api } from "../services/api.js";

interface TechStackAdvisorProps {
  savedProjects: ProjectIdea[];
  initialProject?: ProjectIdea | null;
  onTechStackSaved: (projectId: string, techStack: TechStackRecommendation) => void;
}

export const TechStackAdvisor: React.FC<TechStackAdvisorProps> = ({
  savedProjects,
  initialProject,
  onTechStackSaved,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProject ? initialProject.id : savedProjects[0]?.id || "custom"
  );
  const [title, setTitle] = useState<string>(
    initialProject ? initialProject.title : savedProjects[0]?.title || ""
  );
  const [domain, setDomain] = useState<string>(
    initialProject ? initialProject.domain : savedProjects[0]?.domain || "Artificial Intelligence"
  );
  const [description, setDescription] = useState<string>(
    initialProject ? initialProject.description : savedProjects[0]?.description || ""
  );
  const [teamSize, setTeamSize] = useState<string>("Individual Developer");
  const [experienceLevel, setExperienceLevel] = useState<string>("Intermediate");

  const [loading, setLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<TechStackRecommendation | null>(
    initialProject?.techStack || null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectSaved = (projId: string) => {
    setSelectedProjectId(projId);
    if (projId === "custom") {
      setTitle("");
      setDescription("");
      setRecommendation(null);
      return;
    }
    const found = savedProjects.find((p) => p.id === projId);
    if (found) {
      setTitle(found.title);
      setDomain(found.domain);
      setDescription(found.description);
      setRecommendation(found.techStack || null);
    }
  };

  const handleConsultAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Please enter a project title.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await api.recommendTechStack({
        title,
        domain,
        description,
        teamSize,
        experienceLevel,
        projectId: selectedProjectId !== "custom" ? selectedProjectId : undefined,
      });

      setRecommendation(result);
      if (selectedProjectId && selectedProjectId !== "custom") {
        onTechStackSaved(selectedProjectId, result);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to recommend tech stack.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-xs font-semibold text-indigo-300">
          <Code2 className="w-3.5 h-3.5" />
          <span>AI Chief Technology Officer Advisor</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          AI Tech Stack & Architecture Advisor
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-3xl">
          Receive tailored framework, database, AI library, cloud provider, authentication, and deployment recommendations with in-depth CTO justifications for why each component fits your project best.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleConsultAdvisor} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
        {savedProjects.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Select Target Project for Tech Advice
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => handleSelectSaved(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="custom">+ Advise on a Custom Project Concept</option>
              {savedProjects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.title} ({proj.domain})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Real-Time Autonomous Cashierless Store"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Domain / Industry
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. Computer Vision, Distributed Ledger, HealthTech"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Team Scale
            </label>
            <select
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Individual Developer">Individual Developer (Solo)</option>
              <option value="Small Agile Team (2-4 devs)">Small Agile Team (2-4 devs)</option>
              <option value="Enterprise Engineering Team (5-10+ devs)">Enterprise Engineering Team (5-10+ devs)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Beginner / Student">Beginner / Student</option>
              <option value="Intermediate Developer">Intermediate Developer</option>
              <option value="Senior / Principal Engineer">Senior / Principal Engineer</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Project Overview & Performance Targets
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your throughput requirements, latency targets, and target deployment platforms..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-200">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white whitespace-nowrap shrink-0 transition-all shadow-md cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Architecture Options with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Get CTO Tech Stack Advice</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Recommendations Display */}
      {recommendation && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Recommended Technology Stack Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Tailored for high developer velocity, low maintenance overhead, and production scaling.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 border border-emerald-800/60 text-emerald-300">
              CTO Approved
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Frontend */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Code2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Frontend Framework</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {recommendation.frontendFramework.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {recommendation.frontendFramework.reason}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Alternatives: </span>
                {recommendation.frontendFramework.alternatives.join(", ")}
              </div>
            </div>

            {/* 2. Backend */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Server className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Backend Framework</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {recommendation.backendFramework.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {recommendation.backendFramework.reason}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Alternatives: </span>
                {recommendation.backendFramework.alternatives.join(", ")}
              </div>
            </div>

            {/* 3. Database */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-400">
                  <Database className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Database System</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {recommendation.database.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {recommendation.database.reason}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Alternatives: </span>
                {recommendation.database.alternatives.join(", ")}
              </div>
            </div>

            {/* 4. AI/ML */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-400">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">AI / ML Libraries</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {recommendation.aiMlLibraries.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {recommendation.aiMlLibraries.reason}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Alternatives: </span>
                {recommendation.aiMlLibraries.alternatives.join(", ")}
              </div>
            </div>

            {/* 5. Cloud Platform */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Cloud className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Cloud Platform</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {recommendation.cloudPlatform.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {recommendation.cloudPlatform.reason}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Alternatives: </span>
                {recommendation.cloudPlatform.alternatives.join(", ")}
              </div>
            </div>

            {/* 6. Auth */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-rose-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Auth & Identity</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {recommendation.authenticationSystem.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {recommendation.authenticationSystem.reason}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Alternatives: </span>
                {recommendation.authenticationSystem.alternatives.join(", ")}
              </div>
            </div>

            {/* 7. API Architecture */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">API Architecture</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {recommendation.apiArchitecture.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {recommendation.apiArchitecture.reason}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Alternatives: </span>
                {recommendation.apiArchitecture.alternatives.join(", ")}
              </div>
            </div>

            {/* 8. Deployment */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Container className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Deployment & CI/CD</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {recommendation.deploymentPlatform.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {recommendation.deploymentPlatform.reason}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Alternatives: </span>
                {recommendation.deploymentPlatform.alternatives.join(", ")}
              </div>
            </div>
          </div>

          {/* CTO Architectural Rationale */}
          <div className="bg-slate-900 border border-indigo-900/60 rounded-2xl p-6 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              CTO Architecture Strategy & Rationale
            </span>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
              {recommendation.overallRationale}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
