import React, { useState } from "react";
import {
  GitCompare,
  Sparkles,
  Check,
  Award,
  Clock,
  Layers,
  Code2,
  TrendingUp,
} from "lucide-react";
import { Radar, Bar } from "react-chartjs-2";
import "../utils/chartSetup.js";
import { ProjectIdea } from "../types/index.js";

interface ProjectComparisonProps {
  savedProjects: ProjectIdea[];
  onSelectProject: (project: ProjectIdea) => void;
}

const PALETTE = [
  { border: "#6366f1", bg: "rgba(99, 102, 241, 0.25)" },
  { border: "#10b981", bg: "rgba(16, 185, 129, 0.25)" },
  { border: "#f59e0b", bg: "rgba(245, 158, 11, 0.25)" },
  { border: "#ec4899", bg: "rgba(236, 72, 153, 0.25)" },
];

export const ProjectComparison: React.FC<ProjectComparisonProps> = ({
  savedProjects,
  onSelectProject,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    savedProjects.slice(0, 3).map((p) => p.id)
  );

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const comparedProjects = savedProjects.filter((p) => selectedIds.includes(p.id));

  // Chart datasets
  const radarDatasets = comparedProjects.map((p, idx) => {
    const color = PALETTE[idx % PALETTE.length];
    const innov = (p.innovationScore || 8) * 10;
    const diff = (p.difficultyScore || 6) * 10;
    const ready = p.evaluation?.readinessScore || 80;
    const scale = p.evaluation?.scalabilityScore || 75;
    const feas = p.evaluation?.feasibilityScore || 80;
    const use = p.evaluation?.usefulnessScore || 85;

    return {
      label: p.title.length > 20 ? p.title.slice(0, 20) + "..." : p.title,
      data: [innov, diff, ready, scale, feas, use],
      borderColor: color.border,
      backgroundColor: color.bg,
      borderWidth: 2,
      pointBackgroundColor: color.border,
    };
  });

  const radarData = {
    labels: ["Innovation", "Difficulty", "Readiness", "Scalability", "Feasibility", "Usefulness"],
    datasets: radarDatasets,
  };

  const barData = {
    labels: ["Innovation (/10)", "Difficulty (/10)", "Readiness (/100)", "Scalability (/100)"],
    datasets: comparedProjects.map((p, idx) => {
      const color = PALETTE[idx % PALETTE.length];
      return {
        label: p.title.length > 18 ? p.title.slice(0, 18) + "..." : p.title,
        data: [
          p.innovationScore || 8,
          p.difficultyScore || 6,
          p.evaluation?.readinessScore || 80,
          p.evaluation?.scalabilityScore || 75,
        ],
        backgroundColor: color.border,
        borderRadius: 6,
      };
    }),
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-xs font-semibold text-indigo-300">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Multi-Project Benchmarking Engine</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Project Comparison & Feasibility Overlay
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-3xl">
          Select 2 to 4 project ideas to compare side-by-side across innovation score, difficulty rating, development duration, readiness metrics, and architectural footprint.
        </p>
      </div>

      {/* Project Selector Pills */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Select 2 to 4 Projects to Benchmark:
          </span>
          <span className="text-xs text-slate-400">
            {selectedIds.length} of 4 selected
          </span>
        </div>

        {savedProjects.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No saved projects available for comparison yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {savedProjects.map((p) => {
              const isSelected = selectedIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleSelect(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span className="max-w-[200px] truncate">{p.title}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {comparedProjects.length > 0 && (
        <div className="space-y-8">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white">Comparative Radar Overlay</h3>
              <div className="h-72 flex items-center justify-center">
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
                        labels: { color: "#cbd5e1", font: { size: 11 }, boxWidth: 12 },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white">Multi-Dimensional Metric Comparison</h3>
              <div className="h-72 flex items-center justify-center">
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: { color: "#cbd5e1", font: { size: 11 }, boxWidth: 12 },
                      },
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { color: "#94a3b8", font: { size: 10 } },
                      },
                      y: {
                        grid: { color: "rgba(51, 65, 85, 0.5)" },
                        ticks: { color: "#94a3b8", font: { size: 10 } },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Side-by-Side Spec Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 overflow-hidden">
            <h3 className="text-base font-bold text-white">Side-by-Side Specification Matrix</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="py-3 px-4 text-slate-400 font-semibold uppercase tracking-wider w-40">
                      Criteria
                    </th>
                    {comparedProjects.map((p, idx) => (
                      <th key={p.id} className="py-3 px-4 text-white font-bold max-w-xs">
                        <span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: PALETTE[idx % PALETTE.length].border }}></span>
                        {p.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Domain</td>
                    {comparedProjects.map((p) => (
                      <td key={p.id} className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 text-xs">
                          {p.domain}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Innovation Score</td>
                    {comparedProjects.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-bold text-amber-400">
                        {p.innovationScore} / 10
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Difficulty Rating</td>
                    {comparedProjects.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-bold text-cyan-400">
                        {p.difficultyScore} / 10
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Estimated Timeline</td>
                    {comparedProjects.map((p) => (
                      <td key={p.id} className="py-3 px-4">
                        {p.estimatedDevelopmentTime}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Readiness Score</td>
                    {comparedProjects.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-bold text-emerald-400">
                        {p.evaluation ? `${p.evaluation.readinessScore}%` : "Not evaluated yet"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Core Technologies</td>
                    {comparedProjects.map((p) => (
                      <td key={p.id} className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.technologiesRequired.slice(0, 4).map((t, tIdx) => (
                            <span key={tIdx} className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Hardware Req.</td>
                    {comparedProjects.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-xs">
                        {p.hardwareRequirements?.join(", ") || "None (Software only)"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Action</td>
                    {comparedProjects.map((p) => (
                      <td key={p.id} className="py-3 px-4">
                        <button
                          onClick={() => onSelectProject(p)}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                        >
                          View Full Spec
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
