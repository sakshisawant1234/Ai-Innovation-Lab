import React, { useState } from "react";
import {
  X,
  Sparkles,
  Layers,
  Milestone,
  CheckCircle2,
  Cpu,
  Code2,
  Download,
  Printer,
  Clock,
  Award,
  ShieldCheck,
  Server,
  Database,
  Activity,
  Plus,
} from "lucide-react";
import { ProjectIdea } from "../types/index.js";
import { NavTab } from "./Navbar.js";

interface ProjectDetailsModalProps {
  project: ProjectIdea | null;
  onClose: () => void;
  onNavigateToModule: (tab: NavTab, project: ProjectIdea) => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  onClose,
  onNavigateToModule,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "architecture" | "roadmap" | "features" | "evaluation" | "techStack"
  >("overview");

  if (!project) return null;

  const exportMarkdown = () => {
    let md = `# ${project.title}\n\n`;
    md += `**Domain**: ${project.domain}\n`;
    md += `**Innovation Score**: ${project.innovationScore}/10 | **Difficulty**: ${project.difficultyScore}/10 | **Timeline**: ${project.estimatedDevelopmentTime}\n\n`;
    md += `## 1. Problem Statement\n${project.problemStatement}\n\n`;
    md += `## 2. Description\n${project.description}\n\n`;
    md += `## 3. Key Objectives\n${project.objectives?.map((o) => `- ${o}`).join("\n")}\n\n`;
    md += `## 4. Target Users\n${project.targetUsers?.map((u) => `- ${u}`).join("\n")}\n\n`;
    md += `## 5. Required Technologies\n${project.technologiesRequired?.map((t) => `- ${t}`).join("\n")}\n\n`;
    if (project.hardwareRequirements?.length) {
      md += `## 6. Hardware Requirements\n${project.hardwareRequirements?.map((h) => `- ${h}`).join("\n")}\n\n`;
    }
    if (project.aiMlAlgorithms?.length) {
      md += `## 7. AI/ML Algorithms\n${project.aiMlAlgorithms?.map((a) => `- ${a}`).join("\n")}\n\n`;
    }
    if (project.developmentModules?.length) {
      md += `## 8. Development Modules\n`;
      project.developmentModules.forEach((m) => {
        md += `### ${m.name}\n${m.description}\n\n`;
      });
    }
    if (project.systemArchitectureExplanation) {
      md += `## 9. System Architecture\n${project.systemArchitectureExplanation}\n\n`;
    }
    if (project.evaluation) {
      md += `## 10. Feasibility & Readiness Evaluation\n`;
      md += `- **Readiness Score**: ${project.evaluation.readinessScore}/100\n`;
      md += `- **Innovation**: ${project.evaluation.innovationScore}%\n`;
      md += `- **Technical Feasibility**: ${project.evaluation.feasibilityScore}%\n`;
      md += `- **Estimated Cost**: ${project.evaluation.estimatedCost}\n\n`;
    }

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-spec.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-indigo-300 border border-slate-700">
                {project.domain}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-amber-300">
                Innov: {project.innovationScore}/10
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-cyan-300">
                Diff: {project.difficultyScore}/10
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {project.estimatedDevelopmentTime}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {project.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={exportMarkdown}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Download Markdown Spec"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Print Specification"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          {[
            { id: "overview", label: "Overview & Modules" },
            { id: "architecture", label: "Architecture" },
            { id: "roadmap", label: "Roadmap" },
            { id: "features", label: "Advanced Features" },
            { id: "evaluation", label: "Readiness Score" },
            { id: "techStack", label: "Tech Stack" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeSubTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300">
          {activeSubTab === "overview" && (
            <div className="space-y-6">
              {/* Problem & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-850 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    Problem Statement
                  </span>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                    {project.problemStatement}
                  </p>
                </div>

                <div className="bg-slate-850 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Target Users & Stakeholders
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.targetUsers?.map((u, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs">
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Objectives */}
              <div className="bg-slate-850 border border-slate-800 p-5 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Key Strategic Objectives
                </span>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs text-slate-300">
                  {project.objectives?.map((obj, idx) => (
                    <li key={idx} className="bg-slate-800/70 p-3 rounded-xl flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-indigo-900 text-indigo-300 flex items-center justify-center shrink-0 text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Development Modules */}
              {project.developmentModules?.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Development Modules
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {project.developmentModules.map((m, idx) => (
                      <div key={idx} className="p-4 bg-slate-850 border border-slate-800 rounded-xl space-y-1.5">
                        <h4 className="text-xs font-bold text-white">{m.name}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hardware / Software / AI Algorithms */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-850 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Required Tech</span>
                  <div className="flex flex-wrap gap-1">
                    {project.technologiesRequired.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-emerald-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-850 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Hardware & Edge</span>
                  <p className="text-xs text-slate-300">
                    {project.hardwareRequirements?.join(", ") || "None (Pure Software / Cloud Web App)"}
                  </p>
                </div>

                <div className="bg-slate-850 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Algorithms & AI</span>
                  <p className="text-xs text-slate-300">
                    {project.aiMlAlgorithms?.join(", ") || "Standard Rule Engine & Neural Models"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "architecture" && (
            <div className="space-y-4">
              {project.architecture ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-850 border border-slate-800 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Data Flow</span>
                    <p className="text-xs text-slate-300">{project.architecture.dataFlowDescription}</p>
                  </div>
                  <div className="space-y-3">
                    {project.architecture.layers.map((layer, idx) => (
                      <div key={idx} className="p-4 bg-slate-850 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{layer.layer}</h4>
                          <div className="flex gap-1">
                            {layer.technologies.map((t, tIdx) => (
                              <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-800 text-xs text-cyan-300">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-400">{layer.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-3 border border-dashed border-slate-800 rounded-2xl">
                  <Layers className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">Detailed 6-tier architecture hasn't been generated yet.</p>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToModule("architecture", project);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
                  >
                    Launch Architecture Generator
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSubTab === "roadmap" && (
            <div className="space-y-4">
              {project.roadmap && project.roadmap.length > 0 ? (
                <div className="space-y-3">
                  {project.roadmap.map((phase) => (
                    <div key={phase.id} className="p-4 bg-slate-850 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{phase.name}</h4>
                        <span className="text-xs text-slate-400">{phase.duration}</span>
                      </div>
                      <div className="space-y-1.5 pt-1">
                        {phase.tasks.map((task) => (
                          <div key={task.id} className="flex items-center justify-between text-xs text-slate-300 bg-slate-800/60 p-2 rounded-lg">
                            <span>{task.title}</span>
                            <span className="text-[10px] uppercase font-bold text-purple-300">{task.priority}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3 border border-dashed border-slate-800 rounded-2xl">
                  <Milestone className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">Roadmap not yet generated for this project.</p>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToModule("roadmap", project);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"
                  >
                    Generate 8-Phase Roadmap
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSubTab === "features" && (
            <div className="space-y-4">
              {project.customFeatures && project.customFeatures.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Attached Custom Enhancements</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.customFeatures.map((feat, idx) => (
                      <div key={idx} className="p-3 bg-slate-850 border border-slate-800 rounded-xl flex items-center gap-2 text-xs text-white">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-3 border border-dashed border-slate-800 rounded-2xl">
                  <Cpu className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">No advanced custom features attached yet.</p>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToModule("features", project);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                  >
                    Recommend Advanced Features
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSubTab === "evaluation" && (
            <div className="space-y-4">
              {project.evaluation ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-850 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Overall Readiness Score</span>
                      <span className="text-2xl font-bold text-emerald-400">{project.evaluation.readinessScore}/100</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Estimated Cost</span>
                      <span className="text-xs font-bold text-white">{project.evaluation.estimatedCost}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-850 border border-slate-800 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase">CTO Recommendation</span>
                    <p className="text-xs text-slate-300">{project.evaluation.recommendationSummary}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-3 border border-dashed border-slate-800 rounded-2xl">
                  <CheckCircle2 className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">This project has not been formally evaluated yet.</p>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToModule("evaluator", project);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  >
                    Run Feasibility Audit
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSubTab === "techStack" && (
            <div className="space-y-4">
              {project.techStack ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(project.techStack).map(([key, val]: any) => {
                    if (key === "overallRationale") return null;
                    return (
                      <div key={key} className="p-3.5 bg-slate-850 border border-slate-800 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold uppercase text-slate-400">{key}</span>
                        <h4 className="text-xs font-bold text-white">{val.name}</h4>
                        <p className="text-xs text-slate-300">{val.reason}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3 border border-dashed border-slate-800 rounded-2xl">
                  <Code2 className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">Tech stack advice not yet formulated.</p>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToModule("advisor", project);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                  >
                    Consult Tech Stack Advisor
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">AI Innovation Lab Blueprint System</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
          >
            Close Spec
          </button>
        </div>
      </div>
    </div>
  );
};
