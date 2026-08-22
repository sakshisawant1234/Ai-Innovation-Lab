import React, { useState } from "react";
import {
  Cpu,
  Sparkles,
  Plus,
  Check,
  Zap,
  Radio,
  Eye,
  Shield,
  Layers,
  Bot,
  Smartphone,
  Cloud,
} from "lucide-react";
import { RecommendedFeature, ProjectIdea } from "../types/index.js";
import { api } from "../services/api.js";

interface FeatureRecommenderProps {
  savedProjects: ProjectIdea[];
  initialProject?: ProjectIdea | null;
  onFeatureAddedToProject: (projectId: string, featureTitle: string) => void;
}

export const FeatureRecommender: React.FC<FeatureRecommenderProps> = ({
  savedProjects,
  initialProject,
  onFeatureAddedToProject,
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
  const [techInput, setTechInput] = useState<string>(
    initialProject
      ? initialProject.technologiesRequired.join(", ")
      : savedProjects[0]?.technologiesRequired.join(", ") || "Python, React, FastAPI"
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [features, setFeatures] = useState<RecommendedFeature[]>([]);
  const [addedFeatureIds, setAddedFeatureIds] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectSaved = (projId: string) => {
    setSelectedProjectId(projId);
    if (projId === "custom") {
      setTitle("");
      setDescription("");
      setTechInput("");
      return;
    }
    const found = savedProjects.find((p) => p.id === projId);
    if (found) {
      setTitle(found.title);
      setDomain(found.domain);
      setDescription(found.description);
      setTechInput(found.technologiesRequired.join(", "));
    }
  };

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please enter a project title and description.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setFeatures([]);
    setAddedFeatureIds([]);

    const techArray = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const result = await api.recommendFeatures({
        title,
        domain,
        description,
        technologies: techArray,
        projectId: selectedProjectId !== "custom" ? selectedProjectId : undefined,
      });

      setFeatures(result);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to recommend features.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = (feature: RecommendedFeature) => {
    if (selectedProjectId && selectedProjectId !== "custom") {
      onFeatureAddedToProject(selectedProjectId, feature.title);
      setAddedFeatureIds((prev) => [...prev, feature.id]);
    } else {
      setAddedFeatureIds((prev) => [...prev, feature.id]);
    }
  };

  const categories = ["All", "AI & ML", "IoT & Hardware", "Blockchain & Web3", "Realtime & Comms", "Security & Cloud", "User Experience"];

  const filteredFeatures = features.filter((f) =>
    filterCategory === "All" ? true : f.category === filterCategory
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-xs font-semibold text-indigo-300">
          <Cpu className="w-3.5 h-3.5" />
          <span>AI Feature Enhancement Recommender</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Architect Next-Gen Project Innovations
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-3xl">
          Supercharge any project proposal with Agentic AI, TinyML edge sensors, Zero-Knowledge verification, voice control, and real-time collaboration. Add chosen features directly to your project roadmap.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleRecommend} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
        {savedProjects.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Select Target Project to Enhance
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => handleSelectSaved(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="custom">+ Enhance a Custom Project Idea</option>
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
              placeholder="e.g. Brain-Computer Mobility Interface"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Domain / Field *
            </label>
            <input
              type="text"
              required
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. Healthcare, Robotics, Smart Agriculture"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Current Project Overview *
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the current architecture, features, and target users..."
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
                <span>Synthesizing Advanced Feature Recommendations...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Recommend Advanced Features</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Recommended Features Grid */}
      {features.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Recommended Innovation Upgrades
              </h2>
              <p className="text-xs text-slate-400">
                Click "+ Add to Project Plan" to inject any capability directly into your project specs.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    filterCategory === cat
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feat) => {
              const isAdded = addedFeatureIds.includes(feat.id);

              return (
                <div
                  key={feat.id}
                  className={`bg-slate-900 border rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all ${
                    isAdded ? "border-emerald-500/70 bg-slate-900/90 shadow-md ring-1 ring-emerald-500/30" : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-indigo-300 border border-slate-700">
                        {feat.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-amber-300">
                        +{feat.innovationBoost} Innovation
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">
                      {feat.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {feat.description}
                    </p>

                    <div className="p-3 bg-slate-850 rounded-xl space-y-1 border border-slate-800/80">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                        Direct Value Benefit
                      </span>
                      <p className="text-xs text-slate-300">
                        {feat.benefit}
                      </p>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] font-medium text-slate-400">Suggested Stack:</span>
                      <div className="flex flex-wrap gap-1">
                        {feat.technologies.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-cyan-300 border border-slate-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      Complexity: <strong className="text-white">{feat.implementationComplexity}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleAddFeature(feat)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Plan</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add to Project Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
