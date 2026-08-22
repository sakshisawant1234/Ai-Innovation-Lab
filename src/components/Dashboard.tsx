import React from "react";
import {
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Code2,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { Bar, Doughnut, Radar } from "react-chartjs-2";
import "../utils/chartSetup.js";
import { DashboardStats, ProjectIdea } from "../types/index.js";
import { NavTab } from "./Navbar.js";

interface DashboardProps {
  stats: DashboardStats | null;
  projects: ProjectIdea[];
  loading: boolean;
  setActiveTab: (tab: NavTab) => void;
  onSelectProject: (project: ProjectIdea) => void;
  onNewIdea: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  projects,
  loading,
  setActiveTab,
  onSelectProject,
  onNewIdea,
}) => {
  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Loading innovation analytics...</p>
      </div>
    );
  }

  const domainLabels = stats ? Object.keys(stats.domainDistribution) : [];
  const domainValues = stats ? Object.values(stats.domainDistribution) : [];

  const techLabels = stats ? Object.keys(stats.techDistribution).slice(0, 6) : [];
  const techValues = stats ? Object.values(stats.techDistribution).slice(0, 6) : [];

  const domainChartData = {
    labels: domainLabels.length > 0 ? domainLabels : ["AI", "IoT", "Blockchain", "Healthcare", "Smart City"],
    datasets: [
      {
        label: "Projects by Domain",
        data: domainValues.length > 0 ? domainValues : [12, 8, 6, 5, 4],
        backgroundColor: [
          "#6366f1",
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ec4899",
          "#8b5cf6",
        ],
        borderRadius: 6,
      },
    ],
  };

  const techChartData = {
    labels: techLabels.length > 0 ? techLabels : ["Python", "React", "FastAPI", "TensorFlow", "Node.js"],
    datasets: [
      {
        label: "Technology Usage",
        data: techValues.length > 0 ? techValues : [18, 14, 11, 9, 8],
        backgroundColor: [
          "#4f46e5",
          "#06b6d4",
          "#10b981",
          "#f97316",
          "#a855f7",
          "#e11d48",
        ],
        borderWidth: 0,
      },
    ],
  };

  const radarChartData = {
    labels: ["Innovation", "Feasibility", "Usefulness", "Scalability", "Complexity", "Readiness"],
    datasets: [
      {
        label: "Lab Benchmark Average",
        data: [
          stats?.averageInnovationScore ? stats.averageInnovationScore * 10 : 85,
          78,
          90,
          82,
          70,
          stats?.averageReadinessScore || 84,
        ],
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "#6366f1",
        borderWidth: 2,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#fff",
      },
    ],
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Innovation Lab Intelligence Hub</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Transform Bold Hypotheses Into Production Architectures
          </h1>
          <p className="text-sm md:text-base text-slate-300">
            Generate 5 tailored project concepts, score technical readiness, explore multi-tier architectures, and structure 8-phase actionable roadmaps powered by Gemini AI.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 z-10 shrink-0">
          <button
            onClick={onNewIdea}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white whitespace-nowrap shrink-0 transition-colors shadow-sm cursor-pointer"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Generate 5 Ideas</span>
          </button>
          <button
            onClick={() => setActiveTab("evaluator")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Evaluate Concept</span>
          </button>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Generated</span>
            <Lightbulb className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {stats?.totalProjectsGenerated || projects.length || 0}
          </p>
          <p className="text-xs text-slate-400">Active project specs</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Evaluated</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {stats?.totalProjectsEvaluated || 0}
          </p>
          <p className="text-xs text-slate-400">Readiness audits</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Avg Innovation</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {stats?.averageInnovationScore || 8.8} <span className="text-xs font-normal text-slate-400">/10</span>
          </p>
          <p className="text-xs text-slate-400">Novelty & depth</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Readiness</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {stats?.averageReadinessScore || 85}%
          </p>
          <p className="text-xs text-slate-400">Production feasibility</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Top Domain</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-base font-bold text-white tracking-tight truncate">
            {stats?.mostPopularDomain || "Artificial Intelligence"}
          </p>
          <p className="text-xs text-slate-400">Most explored</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Top Tech</span>
            <Code2 className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-base font-bold text-white tracking-tight truncate">
            {stats?.mostSelectedTechnology || "Python"}
          </p>
          <p className="text-xs text-slate-400">Highest frequency</p>
        </div>
      </div>

      {/* Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Domain Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white tracking-wide">Domain Distribution</h3>
            <span className="text-xs text-slate-400 font-medium">Categorical</span>
          </div>
          <div className="h-56 flex items-center justify-center">
            <Bar
              data={domainChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { color: "#94a3b8", font: { size: 10 } },
                  },
                  y: {
                    grid: { color: "rgba(51, 65, 85, 0.5)" },
                    ticks: { color: "#94a3b8", font: { size: 10 }, stepSize: 1 },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Tech Stack Frequency */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white tracking-wide">Tech Stack Adoption</h3>
            <span className="text-xs text-slate-400 font-medium">Top 6</span>
          </div>
          <div className="h-56 flex items-center justify-center">
            <Doughnut
              data={techChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                    labels: { color: "#cbd5e1", font: { size: 11 }, boxWidth: 12 },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Lab Readiness Radar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white tracking-wide">Lab Score Radar</h3>
            <span className="text-xs text-slate-400 font-medium">6 Dimensions</span>
          </div>
          <div className="h-56 flex items-center justify-center">
            <Radar
              data={radarChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    angleLines: { color: "rgba(51, 65, 85, 0.5)" },
                    grid: { color: "rgba(51, 65, 85, 0.5)" },
                    pointLabels: { color: "#94a3b8", font: { size: 9 } },
                    ticks: { display: false, maxTicksLimit: 5 },
                    min: 0,
                    max: 100,
                  },
                },
                plugins: {
                  legend: { display: false },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Access Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab("features")}
          className="text-left bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl space-y-2 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-950 flex items-center justify-center text-indigo-400 border border-indigo-800/60">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
            <span>Feature Engine</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h4>
          <p className="text-xs text-slate-400">
            Discover cutting-edge AI, IoT, and Web3 add-ons with 1-click project plan injection.
          </p>
        </button>

        <button
          onClick={() => setActiveTab("architecture")}
          className="text-left bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl space-y-2 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400 border border-cyan-800/60">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
            <span>System Architecture</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h4>
          <p className="text-xs text-slate-400">
            Visual multi-tier diagram from Frontend to Database & IoT with deep layer specs.
          </p>
        </button>

        <button
          onClick={() => setActiveTab("roadmap")}
          className="text-left bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl space-y-2 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-800/60">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
            <span>8-Phase Roadmap</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h4>
          <p className="text-xs text-slate-400">
            Track task progress, estimate timelines, and manage dependencies interactively.
          </p>
        </button>

        <button
          onClick={() => setActiveTab("compare")}
          className="text-left bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl space-y-2 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-950 flex items-center justify-center text-purple-400 border border-purple-800/60">
            <Code2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors flex items-center justify-between">
            <span>Project Comparison</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h4>
          <p className="text-xs text-slate-400">
            Benchmark multiple ideas side-by-side on difficulty, cost, scalability, and impact.
          </p>
        </button>
      </div>

      {/* Recent Projects Catalog */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Recent Innovation Projects</h3>
            <p className="text-xs text-slate-400">Saved project architectures and specifications</p>
          </div>
          <button
            onClick={() => setActiveTab("history")}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl space-y-3">
            <Lightbulb className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm text-slate-300 font-medium">No projects generated yet.</p>
            <button
              onClick={onNewIdea}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
            >
              Generate First Project
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800 overflow-hidden rounded-xl border border-slate-800/60">
            {projects.slice(0, 5).map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="p-4 bg-slate-900 hover:bg-slate-850 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700">
                      {project.domain}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                      Diff: {project.difficultyScore}/10
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-amber-300">
                      Innov: {project.innovationScore}/10
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {project.problemStatement || project.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {project.evaluation && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-800/60 text-xs font-semibold text-emerald-300">
                      {project.evaluation.readinessScore}% Ready
                    </span>
                  )}
                  <span className="text-xs text-slate-400 bg-slate-800/70 px-2.5 py-1 rounded-lg">
                    {project.estimatedDevelopmentTime}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
