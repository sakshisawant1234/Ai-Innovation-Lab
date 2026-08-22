import React, { useState } from "react";
import {
  Layers,
  Sparkles,
  ArrowDown,
  Server,
  Globe,
  Database,
  Cpu,
  Radio,
  ShieldCheck,
  Download,
  Copy,
  Check,
  CheckCircle2,
} from "lucide-react";
import { SystemArchitecture, ProjectIdea } from "../types/index.js";
import { api } from "../services/api.js";

interface ArchitectureGeneratorProps {
  savedProjects: ProjectIdea[];
  initialProject?: ProjectIdea | null;
  onArchitectureSaved: (projectId: string, architecture: SystemArchitecture) => void;
}

export const ArchitectureGenerator: React.FC<ArchitectureGeneratorProps> = ({
  savedProjects,
  initialProject,
  onArchitectureSaved,
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

  const [loading, setLoading] = useState<boolean>(false);
  const [architecture, setArchitecture] = useState<SystemArchitecture | null>(
    initialProject?.architecture || null
  );
  const [activeLayerIndex, setActiveLayerIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectSaved = (projId: string) => {
    setSelectedProjectId(projId);
    if (projId === "custom") {
      setTitle("");
      setDescription("");
      setArchitecture(null);
      return;
    }
    const found = savedProjects.find((p) => p.id === projId);
    if (found) {
      setTitle(found.title);
      setDomain(found.domain);
      setDescription(found.description);
      setArchitecture(found.architecture || null);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Please enter a project title.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await api.generateArchitecture({
        title,
        domain,
        description,
        projectId: selectedProjectId !== "custom" ? selectedProjectId : undefined,
      });

      setArchitecture(result);
      if (selectedProjectId && selectedProjectId !== "custom") {
        onArchitectureSaved(selectedProjectId, result);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to generate system architecture.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySpec = () => {
    if (!architecture) return;
    navigator.clipboard.writeText(JSON.stringify(architecture, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const layerIcons = [
    <Globe className="w-5 h-5 text-indigo-400" />,
    <Server className="w-5 h-5 text-cyan-400" />,
    <Layers className="w-5 h-5 text-emerald-400" />,
    <Cpu className="w-5 h-5 text-purple-400" />,
    <Database className="w-5 h-5 text-amber-400" />,
    <Radio className="w-5 h-5 text-rose-400" />,
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-xs font-semibold text-cyan-300">
          <Layers className="w-3.5 h-3.5" />
          <span>AI Multi-Tier System Architect</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Interactive 6-Tier Architecture Diagram
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-3xl">
          Automatically synthesize a production-grade system architecture mapping Frontend, Backend, REST Gateway, AI/ML Inference Engine, Database Persistence, and Edge IoT / External bridges.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
        {savedProjects.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Select Target Project to Architect
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => handleSelectSaved(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="custom">+ Architect a Custom System Concept</option>
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
              placeholder="e.g. Real-Time Drone Agricultural Sentinel"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Domain / Architecture Style
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. Distributed IoT, Serverless Web3, Edge AI"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            System Requirements & Functional Scope
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline performance constraints, expected concurrency, edge sensor protocols, or AI throughput..."
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
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white whitespace-nowrap shrink-0 transition-all shadow-md cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Synthesizing Multi-Tier System Topology...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate System Architecture</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Visual System Architecture Diagram */}
      {architecture && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                System Topology & Layer Inspector
              </h2>
              <p className="text-xs text-slate-400">
                Click any layer in the visual flow to inspect its components, security controls, and tech choices.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySpec}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied JSON" : "Copy Architecture JSON"}</span>
              </button>
            </div>
          </div>

          {/* Flow Diagram Column */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Nodes Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              {architecture.layers.map((layer, idx) => {
                const isActive = activeLayerIndex === idx;
                return (
                  <React.Fragment key={layer.layer}>
                    <div
                      onClick={() => setActiveLayerIndex(idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
                        isActive
                          ? "bg-slate-850 border-cyan-500 shadow-md ring-1 ring-cyan-500/40"
                          : "bg-slate-900 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                          {layerIcons[idx] || <Layers className="w-5 h-5 text-indigo-400" />}
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Tier {idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-white">
                            {layer.layer}
                          </h4>
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {layer.technologies.slice(0, 2).map((t, tIdx) => (
                              <span key={tIdx} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                        {idx + 1}
                      </div>
                    </div>

                    {/* Downward Data Flow Indicator between layers */}
                    {idx < architecture.layers.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <ArrowDown className="w-4 h-4 text-slate-600 animate-pulse" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Layer Inspector Detail (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {architecture.layers[activeLayerIndex] && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                        {layerIcons[activeLayerIndex]}
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase text-cyan-400 tracking-wider">
                          Tier {activeLayerIndex + 1} Inspector
                        </span>
                        <h3 className="text-lg font-bold text-white">
                          {architecture.layers[activeLayerIndex].layer}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Layer Functionality & Role
                    </span>
                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                      {architecture.layers[activeLayerIndex].description}
                    </p>
                  </div>

                  {/* Components */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
                      Core Functional Components
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {architecture.layers[activeLayerIndex].components.map((c, cIdx) => (
                        <div key={cIdx} className="p-2.5 bg-slate-850 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                      Recommended Tech Stack & Libraries
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {architecture.layers[activeLayerIndex].technologies.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Security Best Practices */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Security Controls & Hardening
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {architecture.layers[activeLayerIndex].securityPractices.map((sec, sIdx) => (
                        <li key={sIdx} className="bg-slate-850 p-2.5 rounded-lg border border-slate-800/80 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{sec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Data Flow & Cloud Suggestions */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    End-to-End Data Flow Pipeline
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {architecture.dataFlowDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Infrastructure & Production Deployment
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {architecture.infrastructureSuggestions.map((infra, iIdx) => (
                      <span key={iIdx} className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-medium">
                        {infra}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
