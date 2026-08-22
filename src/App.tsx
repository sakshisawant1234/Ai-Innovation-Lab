import React, { useState, useEffect } from "react";
import { Navbar, NavTab } from "./components/Navbar.js";
import { Dashboard } from "./components/Dashboard.js";
import { ProjectGenerator } from "./components/ProjectGenerator.js";
import { ProjectEvaluator } from "./components/ProjectEvaluator.js";
import { FeatureRecommender } from "./components/FeatureRecommender.js";
import { ArchitectureGenerator } from "./components/ArchitectureGenerator.js";
import { RoadmapGenerator } from "./components/RoadmapGenerator.js";
import { TechStackAdvisor } from "./components/TechStackAdvisor.js";
import { ProjectComparison } from "./components/ProjectComparison.js";
import { ProjectHistory } from "./components/ProjectHistory.js";
import { ProjectDetailsModal } from "./components/ProjectDetailsModal.js";
import { EditProjectModal } from "./components/EditProjectModal.js";
import {
  ProjectIdea,
  DashboardStats,
  ProjectEvaluation,
  SystemArchitecture,
  RoadmapPhase,
  TechStackRecommendation,
} from "./types/index.js";
import { api } from "./services/api.js";
import { CheckCircle2, Info, Sparkles, Terminal } from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [projects, setProjects] = useState<ProjectIdea[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Focus / context project when jumping between tools
  const [contextProject, setContextProject] = useState<ProjectIdea | null>(null);
  const [detailProject, setDetailProject] = useState<ProjectIdea | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectIdea | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Initial load
  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedProjects, fetchedStats] = await Promise.all([
        api.getProjects(),
        api.getStats(),
      ]);
      setProjects(fetchedProjects);
      setStats(fetchedStats);
    } catch (err) {
      console.error("Failed to load initial lab data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProject = async (project: ProjectIdea) => {
    try {
      const saved = await api.saveProject(project);
      setProjects((prev) => {
        const exists = prev.some((p) => p.id === saved.id);
        if (exists) {
          return prev.map((p) => (p.id === saved.id ? saved : p));
        }
        return [saved, ...prev];
      });
      // Refresh stats
      const newStats = await api.getStats();
      setStats(newStats);
      showToast(`Saved "${project.title}" to catalog`);
    } catch (err: any) {
      console.error(err);
      showToast("Failed to save project");
    }
  };

  const handleUpdateProject = async (project: ProjectIdea) => {
    try {
      const updated = await api.updateProject(project.id, project);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingProject(null);
      if (detailProject && detailProject.id === updated.id) {
        setDetailProject(updated);
      }
      showToast("Project specifications updated");
    } catch (err: any) {
      console.error(err);
      showToast("Failed to update project");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await api.deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      const newStats = await api.getStats();
      setStats(newStats);
      showToast("Project removed from catalog");
    } catch (err: any) {
      console.error(err);
      showToast("Failed to delete project");
    }
  };

  const handleEvaluationCompleted = (projectId: string | null, evaluation: ProjectEvaluation) => {
    if (projectId) {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, evaluation } : p))
      );
    }
    // Refresh stats
    api.getStats().then(setStats).catch(console.error);
    showToast(`Evaluation completed: ${evaluation.readinessScore}% Readiness Score`);
  };

  const handleFeatureAddedToProject = async (projectId: string, featureTitle: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;

    const existingFeatures = target.customFeatures || [];
    if (existingFeatures.includes(featureTitle)) {
      showToast("Feature is already in project plan");
      return;
    }

    const updated = {
      ...target,
      customFeatures: [...existingFeatures, featureTitle],
    };

    try {
      await api.updateProject(projectId, updated);
      setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));
      showToast(`Added "${featureTitle}" to ${target.title}`);
    } catch (err) {
      console.error(err);
      showToast("Failed to attach feature to project");
    }
  };

  const handleArchitectureSaved = (projectId: string, architecture: SystemArchitecture) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, architecture } : p))
    );
    showToast("Architecture mapped to project blueprint");
  };

  const handleRoadmapUpdated = (projectId: string, roadmap: RoadmapPhase[]) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, roadmap } : p))
    );
  };

  const handleTechStackSaved = (projectId: string, techStack: TechStackRecommendation) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, techStack } : p))
    );
    showToast("Tech stack advice saved to project");
  };

  const handleActionTrigger = (
    action: "evaluator" | "architecture" | "roadmap" | "features" | "advisor",
    project: ProjectIdea
  ) => {
    setContextProject(project);
    setActiveTab(action);
  };

  const handleSelectProjectFromDashboard = (project: ProjectIdea) => {
    setDetailProject(project);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
        }}
        savedProjectsCount={projects.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === "dashboard" && (
          <Dashboard
            stats={stats}
            projects={projects}
            loading={loading}
            setActiveTab={setActiveTab}
            onSelectProject={(p) => setDetailProject(p)}
            onNewIdea={() => setActiveTab("generator")}
          />
        )}

        {activeTab === "generator" && (
          <ProjectGenerator
            onProjectsGenerated={(ideas) => {
              showToast(`Generated 5 project concepts`);
            }}
            onSelectProject={(p) => setDetailProject(p)}
            onActionTrigger={handleActionTrigger}
            onSaveProject={handleSaveProject}
            savedProjectIds={projects.map((p) => p.id)}
          />
        )}

        {activeTab === "evaluator" && (
          <ProjectEvaluator
            savedProjects={projects}
            initialProject={contextProject}
            onEvaluationCompleted={handleEvaluationCompleted}
          />
        )}

        {activeTab === "features" && (
          <FeatureRecommender
            savedProjects={projects}
            initialProject={contextProject}
            onFeatureAddedToProject={handleFeatureAddedToProject}
          />
        )}

        {activeTab === "architecture" && (
          <ArchitectureGenerator
            savedProjects={projects}
            initialProject={contextProject}
            onArchitectureSaved={handleArchitectureSaved}
          />
        )}

        {activeTab === "roadmap" && (
          <RoadmapGenerator
            savedProjects={projects}
            initialProject={contextProject}
            onRoadmapUpdated={handleRoadmapUpdated}
          />
        )}

        {activeTab === "advisor" && (
          <TechStackAdvisor
            savedProjects={projects}
            initialProject={contextProject}
            onTechStackSaved={handleTechStackSaved}
          />
        )}

        {activeTab === "compare" && (
          <ProjectComparison
            savedProjects={projects}
            onSelectProject={(p) => setDetailProject(p)}
          />
        )}

        {activeTab === "history" && (
          <ProjectHistory
            projects={projects}
            onSelectProject={(p) => setDetailProject(p)}
            onEditProject={(p) => setEditingProject(p)}
            onDeleteProject={handleDeleteProject}
            onNewProject={() => setActiveTab("generator")}
          />
        )}
      </main>

      {/* Modals */}
      {detailProject && (
        <ProjectDetailsModal
          project={detailProject}
          onClose={() => setDetailProject(null)}
          onNavigateToModule={(tab, p) => {
            setContextProject(p);
            setActiveTab(tab);
          }}
        />
      )}

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleUpdateProject}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-2xl shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <p>AI Innovation Lab · Comprehensive Intelligent Project Ideation, Architecture & Engineering Suite</p>
      </footer>
    </div>
  );
}

export default App;
