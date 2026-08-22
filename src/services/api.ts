import {
  ProjectIdea,
  ProjectEvaluation,
  RecommendedFeature,
  SystemArchitecture,
  RoadmapPhase,
  TechStackRecommendation,
  DashboardStats,
} from "../types/index.js";

const BASE_URL = "/api";

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const body = await res.json();
  if (!res.ok || body.success === false) {
    throw new Error(body.message || body.error || `HTTP error ${res.status}`);
  }

  return body.data as T;
}

export const api = {
  // 1. Generate 5 Project Ideas
  generateProjects: (params: {
    domain: string;
    technologies: string[];
    difficulty: string;
    duration: string;
    projectScope: string;
    projectType: string;
    autoSave?: boolean;
  }): Promise<ProjectIdea[]> => {
    return fetchJSON<ProjectIdea[]>("/projects/generate", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  // 2. Evaluate a Project Idea
  evaluateProject: (params: {
    title: string;
    domain: string;
    description: string;
    technologies?: string[];
    targetUsers?: string;
    problemStatement?: string;
    projectId?: string;
  }): Promise<ProjectEvaluation> => {
    return fetchJSON<ProjectEvaluation>("/projects/evaluate", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  // 3. Recommend Advanced Features
  recommendFeatures: (params: {
    title: string;
    domain: string;
    description: string;
    technologies?: string[];
    projectId?: string;
  }): Promise<RecommendedFeature[]> => {
    return fetchJSON<RecommendedFeature[]>("/projects/recommend-features", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  // 4. Generate Visual System Architecture
  generateArchitecture: (params: {
    title: string;
    domain: string;
    description: string;
    technologies?: string[];
    projectId?: string;
  }): Promise<SystemArchitecture> => {
    return fetchJSON<SystemArchitecture>("/projects/architecture", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  // 5. Generate Development Roadmap
  generateRoadmap: (params: {
    title: string;
    domain: string;
    description: string;
    estimatedDevelopmentTime?: string;
    projectId?: string;
  }): Promise<RoadmapPhase[]> => {
    return fetchJSON<RoadmapPhase[]>("/projects/roadmap", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  // 6. Recommend Tech Stack
  recommendTechStack: (params: {
    title: string;
    domain: string;
    description: string;
    teamSize?: string;
    experienceLevel?: string;
    projectId?: string;
  }): Promise<TechStackRecommendation> => {
    return fetchJSON<TechStackRecommendation>("/projects/tech-stack", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  // 7. Get All Projects (with optional filters)
  getProjects: (filters?: {
    domain?: string;
    difficulty?: string;
    search?: string;
  }): Promise<ProjectIdea[]> => {
    const params = new URLSearchParams();
    if (filters?.domain) params.append("domain", filters.domain);
    if (filters?.difficulty) params.append("difficulty", filters.difficulty);
    if (filters?.search) params.append("search", filters.search);
    const query = params.toString() ? `?${params.toString()}` : "";
    return fetchJSON<ProjectIdea[]>(`/projects${query}`);
  },

  // 8. Get Single Project by ID
  getProjectById: (id: string): Promise<ProjectIdea> => {
    return fetchJSON<ProjectIdea>(`/projects/${id}`);
  },

  // 9. Save / Create Project
  saveProject: (project: ProjectIdea): Promise<ProjectIdea> => {
    return fetchJSON<ProjectIdea>("/projects", {
      method: "POST",
      body: JSON.stringify(project),
    });
  },

  // 10. Update Project
  updateProject: (id: string, updates: Partial<ProjectIdea>): Promise<ProjectIdea> => {
    return fetchJSON<ProjectIdea>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  // 11. Delete Project
  deleteProject: (id: string): Promise<{ id: string }> => {
    return fetchJSON<{ id: string }>(`/projects/${id}`, {
      method: "DELETE",
    });
  },

  // 12. Dashboard Stats
  getDashboardStats: (): Promise<DashboardStats> => {
    return fetchJSON<DashboardStats>("/dashboard/stats");
  },
  getStats: (): Promise<DashboardStats> => {
    return fetchJSON<DashboardStats>("/dashboard/stats");
  },
};
