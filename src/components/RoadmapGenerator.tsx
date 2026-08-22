import React, { useState } from "react";
import {
  Milestone,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { RoadmapPhase, RoadmapTask, ProjectIdea } from "../types/index.js";
import { api } from "../services/api.js";

interface RoadmapGeneratorProps {
  savedProjects: ProjectIdea[];
  initialProject?: ProjectIdea | null;
  onRoadmapUpdated: (projectId: string, roadmap: RoadmapPhase[]) => void;
}

export const RoadmapGenerator: React.FC<RoadmapGeneratorProps> = ({
  savedProjects,
  initialProject,
  onRoadmapUpdated,
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
  const [duration, setDuration] = useState<string>(
    initialProject ? initialProject.estimatedDevelopmentTime : "2 Months"
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>(
    initialProject?.roadmap || []
  );
  const [expandedPhaseIds, setExpandedPhaseIds] = useState<string[]>(
    initialProject?.roadmap ? initialProject.roadmap.map((p) => p.id) : []
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectSaved = (projId: string) => {
    setSelectedProjectId(projId);
    if (projId === "custom") {
      setTitle("");
      setDescription("");
      setRoadmap([]);
      return;
    }
    const found = savedProjects.find((p) => p.id === projId);
    if (found) {
      setTitle(found.title);
      setDomain(found.domain);
      setDescription(found.description);
      setDuration(found.estimatedDevelopmentTime || "2 Months");
      if (found.roadmap && found.roadmap.length > 0) {
        setRoadmap(found.roadmap);
        setExpandedPhaseIds(found.roadmap.map((p) => p.id));
      }
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
      const result = await api.generateRoadmap({
        title,
        domain,
        description,
        estimatedDevelopmentTime: duration,
        projectId: selectedProjectId !== "custom" ? selectedProjectId : undefined,
      });

      setRoadmap(result);
      setExpandedPhaseIds(result.map((p) => p.id));
      if (selectedProjectId && selectedProjectId !== "custom") {
        onRoadmapUpdated(selectedProjectId, result);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (phaseId: string, taskId: string) => {
    const updated = roadmap.map((phase) => {
      if (phase.id !== phaseId) return phase;
      const updatedTasks = phase.tasks.map((task) => {
        if (task.id !== taskId) return task;
        return { ...task, completed: !task.completed };
      });
      return { ...phase, tasks: updatedTasks };
    });

    setRoadmap(updated);
    if (selectedProjectId && selectedProjectId !== "custom") {
      onRoadmapUpdated(selectedProjectId, updated);
    }

    // Check if total tasks are now 100% complete
    let total = 0;
    let completed = 0;
    for (const p of updated) {
      for (const t of p.tasks) {
        total++;
        if (t.completed) completed++;
      }
    }

    if (total > 0 && completed === total) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const togglePhaseExpand = (phaseId: string) => {
    setExpandedPhaseIds((prev) =>
      prev.includes(phaseId) ? prev.filter((id) => id !== phaseId) : [...prev, phaseId]
    );
  };

  // Compute progress stats
  let totalTasks = 0;
  let completedTasks = 0;
  for (const p of roadmap) {
    for (const t of p.tasks) {
      totalTasks++;
      if (t.completed) completedTasks++;
    }
  }

  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800/60 text-xs font-semibold text-purple-300">
          <Milestone className="w-3.5 h-3.5" />
          <span>Actionable Engineering Roadmap</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          8-Phase Development Roadmap Generator
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-3xl">
          Convert your high-level project vision into an 8-phase milestone breakdown with priority flags, task durations, dependencies, and interactive completion tracking.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
        {savedProjects.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Select Target Project for Roadmap
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => handleSelectSaved(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="custom">+ Create Roadmap for Custom Project</option>
              {savedProjects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.title} ({proj.domain})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Brain-Computer Mobility Interface"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Target Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="2 Weeks">2 Weeks (MVP Sprint)</option>
              <option value="1 Month">1 Month (Prototype)</option>
              <option value="2 Months">2 Months (Standard)</option>
              <option value="3 Months">3 Months (Full System)</option>
              <option value="6 Months">6 Months (Enterprise / Thesis)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Scope & Technical Constraints
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Specify key deliverables, hardware dependencies, and release targets..."
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
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white whitespace-nowrap shrink-0 transition-all shadow-md cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Synthesizing 8 Engineering Phases with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate 8-Phase Roadmap</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Progress & Milestone Overview */}
      {roadmap.length > 0 && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Development Progress Tracker
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {completedTasks} of {totalTasks} Tasks Completed ({completionPercentage}%)
              </h3>
              <div className="w-full md:w-96 h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Estimated Schedule:</span>
                <span className="text-sm font-bold text-white">{duration}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-300 font-bold text-lg">
                {completionPercentage}%
              </div>
            </div>
          </div>

          {/* 8 Phase Timeline List */}
          <div className="space-y-4">
            {roadmap.map((phase) => {
              const isExpanded = expandedPhaseIds.includes(phase.id);
              const phaseCompletedTasks = phase.tasks.filter((t) => t.completed).length;
              const isPhaseComplete = phase.tasks.length > 0 && phaseCompletedTasks === phase.tasks.length;

              return (
                <div
                  key={phase.id}
                  className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all ${
                    isPhaseComplete
                      ? "border-emerald-800/80 bg-slate-900/90"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {/* Phase Header */}
                  <div
                    onClick={() => togglePhaseExpand(phase.id)}
                    className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none bg-slate-900 hover:bg-slate-850"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                          isPhaseComplete
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-800 text-purple-300 border border-slate-700"
                        }`}
                      >
                        {isPhaseComplete ? <CheckCircle2 className="w-5 h-5" /> : `P${phase.phaseNumber}`}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm md:text-base font-bold text-white">
                            {phase.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
                            {phase.duration}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {phase.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-semibold text-slate-400">
                        {phaseCompletedTasks}/{phase.tasks.length}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tasks List */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-800 bg-slate-900/60 space-y-2.5">
                      {phase.tasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(phase.id, task.id)}
                          className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                            task.completed
                              ? "bg-emerald-950/30 border-emerald-800/60 text-slate-400 line-through"
                              : "bg-slate-850 border-slate-800 hover:border-slate-700 text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="shrink-0 text-slate-400">
                              {task.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400 transition-colors" />
                              )}
                            </div>
                            <span className="text-xs md:text-sm font-medium">
                              {task.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                task.priority === "Critical"
                                  ? "bg-rose-950 text-rose-300 border border-rose-800"
                                  : task.priority === "High"
                                  ? "bg-amber-950 text-amber-300 border border-amber-800"
                                  : "bg-slate-800 text-slate-300"
                              }`}
                            >
                              {task.priority}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {task.duration}
                            </span>
                          </div>
                        </div>
                      ))}
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
