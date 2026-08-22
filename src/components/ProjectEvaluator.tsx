import React, { useState } from "react";
import {
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  PlusCircle,
  TrendingUp,
  DollarSign,
  Award,
  Layers,
  ChevronRight,
  Bookmark,
} from "lucide-react";
import { Radar, Bar } from "react-chartjs-2";
import "../utils/chartSetup.js";
import { ProjectEvaluation, ProjectIdea } from "../types/index.js";
import { api } from "../services/api.js";

interface ProjectEvaluatorProps {
  savedProjects: ProjectIdea[];
  initialProject?: ProjectIdea | null;
  onEvaluationCompleted: (projectId: string | null, evaluation: ProjectEvaluation) => void;
}

export const ProjectEvaluator: React.FC<ProjectEvaluatorProps> = ({
  savedProjects,
  initialProject,
  onEvaluationCompleted,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProject ? initialProject.id : "custom"
  );
  const [title, setTitle] = useState<string>(initialProject ? initialProject.title : "");
  const [domain, setDomain] = useState<string>(initialProject ? initialProject.domain : "Artificial Intelligence");
  const [description, setDescription] = useState<string>(initialProject ? initialProject.description : "");
  const [problemStatement, setProblemStatement] = useState<string>(
    initialProject ? initialProject.problemStatement : ""
  );
  const [techInput, setTechInput] = useState<string>(
    initialProject ? initialProject.technologiesRequired.join(", ") : "Python, FastAPI, React, PyTorch"
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<ProjectEvaluation | null>(
    initialProject?.evaluation || null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectSaved = (projectId: string) => {
    setSelectedProjectId(projectId);
    if (projectId === "custom") {
      setTitle("");
      setDescription("");
      setProblemStatement("");
      setTechInput("");
      setEvaluation(null);
      return;
    }

    const found = savedProjects.find((p) => p.id === projectId);
    if (found) {
      setTitle(found.title);
      setDomain(found.domain);
      setDescription(found.description);
      setProblemStatement(found.problemStatement || "");
      setTechInput(found.technologiesRequired.join(", "));
      setEvaluation(found.evaluation || null);
    }
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please provide a project title and description to evaluate.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const techArray = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const result = await api.evaluateProject({
        title,
        domain,
        description,
        problemStatement,
        technologies: techArray,
        projectId: selectedProjectId !== "custom" ? selectedProjectId : undefined,
      });

      setEvaluation(result);
      onEvaluationCompleted(selectedProjectId !== "custom" ? selectedProjectId : null, result);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Evaluation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const radarData = evaluation
    ? {
        labels: ["Innovation", "Feasibility", "Usefulness", "Scalability", "Complexity", "Readiness"],
        datasets: [
          {
            label: "Evaluated Idea Score",
            data: [
              evaluation.innovationScore,
              evaluation.feasibilityScore,
              evaluation.usefulnessScore,
              evaluation.scalabilityScore,
              evaluation.complexityScore,
              evaluation.readinessScore,
            ],
            backgroundColor: "rgba(99, 102, 241, 0.25)",
            borderColor: "#6366f1",
            borderWidth: 2,
            pointBackgroundColor: "#6366f1",
            pointBorderColor: "#fff",
          },
          {
            label: "Production Benchmark",
            data: [75, 80, 85, 75, 60, 80],
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            borderColor: "#10b981",
            borderWidth: 1.5,
            borderDash: [4, 4],
            pointBackgroundColor: "#10b981",
          },
        ],
      }
    : null;

  const barData = evaluation
    ? {
        labels: ["Innovation", "Feasibility", "Usefulness", "Scalability", "Readiness"],
        datasets: [
          {
            label: "Score (%)",
            data: [
              evaluation.innovationScore,
              evaluation.feasibilityScore,
              evaluation.usefulnessScore,
              evaluation.scalabilityScore,
              evaluation.readinessScore,
            ],
            backgroundColor: ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#8b5cf6"],
            borderRadius: 6,
          },
        ],
      }
    : null;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-xs font-semibold text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>AI Project Readiness Evaluator</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Technical Feasibility & Readiness Scoring
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-3xl">
          Submit your project proposal or choose a saved draft. Gemini AI analyzes feasibility, technical debt risks, security vulnerabilities, estimated cloud costs, and missing high-impact features with a 0-100 Readiness Score.
        </p>
      </div>

      {/* Form & Selection */}
      <form onSubmit={handleEvaluate} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
        {/* Saved Project Selector */}
        {savedProjects.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Select From Saved Catalog or Enter New
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => handleSelectSaved(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="custom">+ Evaluate a New Custom Project Idea</option>
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
              placeholder="e.g. Autonomous Drone Crop Pest Sentinel..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Domain / Industry *
            </label>
            <input
              type="text"
              required
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. Healthcare, IoT, FinTech, Robotics..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Problem Statement
          </label>
          <input
            type="text"
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            placeholder="What critical pain point or inefficiency is being tackled?"
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Project Description & Technical Approach *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the architectural concept, intended data pipelines, AI models, and user workflow..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Key Technologies (comma-separated)
          </label>
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="e.g. Python, FastAPI, TensorFlow Lite, React, Docker, ESP32"
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
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
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white whitespace-nowrap shrink-0 transition-all shadow-md cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Auditing Project Feasibility with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Project Readiness</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Evaluation Results Section */}
      {evaluation && (
        <div className="space-y-6">
          {/* Top Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Overall Readiness Gauge */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-2 md:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Project Readiness Score
              </span>
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      evaluation.readinessScore >= 80
                        ? "text-emerald-500"
                        : evaluation.readinessScore >= 60
                        ? "text-amber-500"
                        : "text-rose-500"
                    }
                    strokeDasharray={`${evaluation.readinessScore}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {evaluation.readinessScore}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">/100</span>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {evaluation.readinessScore >= 85
                  ? "Production Ready"
                  : evaluation.readinessScore >= 70
                  ? "Strong Prototype"
                  : "Needs Refinement"}
              </span>
            </div>

            {/* Metric Bars */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:col-span-3 space-y-3.5 flex flex-col justify-center">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-indigo-300">Innovation Index</span>
                  <span className="text-white">{evaluation.innovationScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${evaluation.innovationScore}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-cyan-300">Technical Feasibility</span>
                  <span className="text-white">{evaluation.feasibilityScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${evaluation.feasibilityScore}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-300">Real-World Usefulness</span>
                  <span className="text-white">{evaluation.usefulnessScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${evaluation.usefulnessScore}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-amber-300">Scalability Potential</span>
                  <span className="text-white">{evaluation.scalabilityScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${evaluation.scalabilityScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white">Multi-Dimensional Radar Assessment</h3>
              <div className="h-64 flex items-center justify-center">
                {radarData && (
                  <Radar
                    data={radarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          angleLines: { color: "rgba(51, 65, 85, 0.5)" },
                          grid: { color: "rgba(51, 65, 85, 0.5)" },
                          pointLabels: { color: "#94a3b8", font: { size: 10 } },
                          ticks: { display: false },
                          min: 0,
                          max: 100,
                        },
                      },
                      plugins: {
                        legend: {
                          position: "top",
                          labels: { color: "#cbd5e1", font: { size: 11 } },
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white">Metric Score Breakdown</h3>
              <div className="h-64 flex items-center justify-center">
                {barData && (
                  <Bar
                    data={barData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { color: "#94a3b8", font: { size: 10 } },
                        },
                        y: {
                          grid: { color: "rgba(51, 65, 85, 0.5)" },
                          ticks: { color: "#94a3b8", font: { size: 10 } },
                          min: 0,
                          max: 100,
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Detailed Audit Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Challenges */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Possible Challenges</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {evaluation.possibleChallenges.map((ch, idx) => (
                  <li key={idx} className="bg-slate-850 p-2.5 rounded-lg border border-slate-800">
                    {ch}
                  </li>
                ))}
              </ul>
            </div>

            {/* Security */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Security & Hardening</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {evaluation.securityConcerns.map((sec, idx) => (
                  <li key={idx} className="bg-slate-850 p-2.5 rounded-lg border border-slate-800">
                    {sec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Features & Cost */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <PlusCircle className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Missing High-Impact Features</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {evaluation.missingFeatures.map((mf, idx) => (
                  <li key={idx} className="bg-slate-850 p-2.5 rounded-lg border border-slate-800">
                    {mf}
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Estimated Cloud & Infra:</span>
                <span className="font-semibold text-white">{evaluation.estimatedCost}</span>
              </div>
            </div>
          </div>

          {/* Verdict Summary */}
          <div className="bg-slate-900 border border-indigo-900/60 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              CTO Verdict & Recommendation Summary
            </span>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
              {evaluation.recommendationSummary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
