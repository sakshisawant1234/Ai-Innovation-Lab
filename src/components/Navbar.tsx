import React from "react";
import {
  Sparkles,
  LayoutDashboard,
  Lightbulb,
  CheckCircle2,
  Cpu,
  Layers,
  Milestone,
  Code2,
  GitCompare,
  History,
  PlusCircle,
} from "lucide-react";

export type NavTab =
  | "dashboard"
  | "generator"
  | "evaluator"
  | "features"
  | "architecture"
  | "roadmap"
  | "advisor"
  | "compare"
  | "history";

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onNewProjectClick: () => void;
  totalSaved: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewProjectClick,
  totalSaved,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "generator", label: "Idea Generator", icon: <Lightbulb className="w-4 h-4" /> },
    { id: "evaluator", label: "Evaluator", icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: "features", label: "Feature Engine", icon: <Cpu className="w-4 h-4" /> },
    { id: "architecture", label: "Architecture", icon: <Layers className="w-4 h-4" /> },
    { id: "roadmap", label: "Roadmap", icon: <Milestone className="w-4 h-4" /> },
    { id: "advisor", label: "Tech Advisor", icon: <Code2 className="w-4 h-4" /> },
    { id: "compare", label: "Compare", icon: <GitCompare className="w-4 h-4" /> },
    { id: "history", label: `Catalog (${totalSaved})`, icon: <History className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-slate-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Text Element (No children below, no descriptor) */}
        <button
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-indigo-400 hover:text-indigo-300 transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md py-1 px-2"
        >
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="whitespace-nowrap">AI Innovation Lab</span>
        </button>

        {/* Zone 2: Navigation Links (Single line, truncated / scrollable on mobile) */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none max-w-full">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onNewProjectClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white whitespace-nowrap shrink-0 transition-colors shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Idea</span>
          </button>
        </div>
      </div>
    </header>
  );
};
