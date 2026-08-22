import { Router, Request, Response } from "express";
import { db } from "./db.js";
import {
  generateProjectIdeas,
  evaluateProjectIdea,
  recommendFeatures,
  generateArchitecture,
  generateRoadmap,
  recommendTechStack,
} from "./geminiService.js";
import { ProjectIdea } from "../src/types/index.js";

export const apiRouter = Router();

// Standard response helper
function successResponse<T>(res: Response, message: string, data: T, status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

function errorResponse(res: Response, message: string, error?: any, status = 500) {
  return res.status(status).json({
    success: false,
    message,
    error: error instanceof Error ? error.message : error || null,
  });
}

/**
 * POST /api/projects/generate
 * Generates 5 unique and practical project ideas
 */
apiRouter.post("/projects/generate", async (req: Request, res: Response) => {
  try {
    const { domain, technologies, difficulty, duration, projectScope, projectType, autoSave } = req.body;

    if (!domain) {
      return errorResponse(res, "Domain is required", null, 400);
    }

    const ideas = await generateProjectIdeas({
      domain,
      technologies: Array.isArray(technologies) ? technologies : [],
      difficulty: difficulty || "Intermediate",
      duration: duration || "1-3 Months",
      projectScope: projectScope || "Individual",
      projectType: projectType || "Full Stack",
    });

    if (autoSave) {
      db.createMany(ideas);
    }

    return successResponse(res, "5 project ideas generated successfully", ideas);
  } catch (error) {
    console.error("Error generating projects:", error);
    return errorResponse(res, "Failed to generate project ideas", error);
  }
});

/**
 * POST /api/projects/evaluate
 * Evaluates a project idea and scores readiness
 */
apiRouter.post("/projects/evaluate", async (req: Request, res: Response) => {
  try {
    const { title, domain, description, technologies, targetUsers, problemStatement, projectId } = req.body;

    if (!title || !description) {
      return errorResponse(res, "Project title and description are required for evaluation", null, 400);
    }

    const evaluation = await evaluateProjectIdea({
      title,
      domain: domain || "General Technology",
      description,
      technologies: Array.isArray(technologies) ? technologies : [],
      targetUsers,
      problemStatement,
    });

    // If a projectId was provided, attach the evaluation directly
    if (projectId) {
      db.update(projectId, { evaluation });
    }

    return successResponse(res, "Project evaluated successfully", evaluation);
  } catch (error) {
    console.error("Error evaluating project:", error);
    return errorResponse(res, "Failed to evaluate project", error);
  }
});

/**
 * POST /api/projects/recommend-features
 * Recommends 6 innovative advanced features
 */
apiRouter.post("/projects/recommend-features", async (req: Request, res: Response) => {
  try {
    const { title, domain, description, technologies, projectId } = req.body;

    if (!title || !description) {
      return errorResponse(res, "Project title and description are required", null, 400);
    }

    const features = await recommendFeatures({
      title,
      domain: domain || "Technology",
      description,
      technologies: Array.isArray(technologies) ? technologies : [],
    });

    return successResponse(res, "Advanced features recommended successfully", features);
  } catch (error) {
    console.error("Error recommending features:", error);
    return errorResponse(res, "Failed to recommend features", error);
  }
});

/**
 * POST /api/projects/architecture
 * Generates visual multi-layer system architecture
 */
apiRouter.post("/projects/architecture", async (req: Request, res: Response) => {
  try {
    const { title, domain, description, technologies, projectId } = req.body;

    if (!title) {
      return errorResponse(res, "Project title is required", null, 400);
    }

    const architecture = await generateArchitecture({
      title,
      domain: domain || "Artificial Intelligence",
      description: description || "Intelligent software application",
      technologies: Array.isArray(technologies) ? technologies : [],
    });

    if (projectId) {
      db.update(projectId, { architecture });
    }

    return successResponse(res, "System architecture generated successfully", architecture);
  } catch (error) {
    console.error("Error generating architecture:", error);
    return errorResponse(res, "Failed to generate system architecture", error);
  }
});

/**
 * POST /api/projects/roadmap
 * Generates an 8-phase actionable development roadmap
 */
apiRouter.post("/projects/roadmap", async (req: Request, res: Response) => {
  try {
    const { title, domain, description, estimatedDevelopmentTime, projectId } = req.body;

    if (!title) {
      return errorResponse(res, "Project title is required", null, 400);
    }

    const roadmap = await generateRoadmap({
      title,
      domain: domain || "Technology",
      description: description || "Software application",
      estimatedDevelopmentTime,
    });

    if (projectId) {
      db.update(projectId, { roadmap });
    }

    return successResponse(res, "Development roadmap generated successfully", roadmap);
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return errorResponse(res, "Failed to generate roadmap", error);
  }
});

/**
 * POST /api/projects/tech-stack
 * Recommends optimal tech stack with deep CTO rationale
 */
apiRouter.post("/projects/tech-stack", async (req: Request, res: Response) => {
  try {
    const { title, domain, description, teamSize, experienceLevel, projectId } = req.body;

    if (!title) {
      return errorResponse(res, "Project title is required", null, 400);
    }

    const techStack = await recommendTechStack({
      title,
      domain: domain || "General",
      description: description || "Software project",
      teamSize,
      experienceLevel,
    });

    if (projectId) {
      db.update(projectId, { techStack });
    }

    return successResponse(res, "Tech stack recommended successfully", techStack);
  } catch (error) {
    console.error("Error recommending tech stack:", error);
    return errorResponse(res, "Failed to recommend tech stack", error);
  }
});

/**
 * GET /api/projects
 * Retrieves all saved projects with search & filter
 */
apiRouter.get("/projects", (req: Request, res: Response) => {
  try {
    const { domain, difficulty, search } = req.query;
    let projects = db.getAll();

    if (typeof domain === "string" && domain !== "All") {
      projects = projects.filter((p) => p.domain.toLowerCase() === domain.toLowerCase());
    }

    if (typeof difficulty === "string" && difficulty !== "All") {
      if (difficulty === "Beginner") projects = projects.filter((p) => p.difficultyScore <= 4);
      else if (difficulty === "Intermediate") projects = projects.filter((p) => p.difficultyScore >= 5 && p.difficultyScore <= 6);
      else if (difficulty === "Advanced") projects = projects.filter((p) => p.difficultyScore >= 7 && p.difficultyScore <= 8);
      else if (difficulty === "Expert") projects = projects.filter((p) => p.difficultyScore >= 9);
    }

    if (typeof search === "string" && search.trim() !== "") {
      const q = search.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.technologiesRequired.some((t) => t.toLowerCase().includes(q))
      );
    }

    return successResponse(res, "Projects fetched successfully", projects);
  } catch (error) {
    return errorResponse(res, "Failed to fetch projects", error);
  }
});

/**
 * POST /api/projects
 * Create or save a project
 */
apiRouter.post("/projects", (req: Request, res: Response) => {
  try {
    const project: ProjectIdea = req.body;
    if (!project.title || !project.domain) {
      return errorResponse(res, "Project title and domain are required", null, 400);
    }

    if (!project.id) {
      project.id = `proj-${Date.now()}`;
    }
    if (!project.createdAt) {
      project.createdAt = new Date().toISOString();
    }

    const saved = db.create(project);
    return successResponse(res, "Project saved successfully", saved, 201);
  } catch (error) {
    return errorResponse(res, "Failed to save project", error);
  }
});

/**
 * GET /api/projects/:id
 * Retrieve a single project by ID
 */
apiRouter.get("/projects/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = db.getById(id);
    if (!project) {
      return errorResponse(res, `Project with ID ${id} not found`, null, 404);
    }
    return successResponse(res, "Project fetched successfully", project);
  } catch (error) {
    return errorResponse(res, "Failed to fetch project", error);
  }
});

/**
 * PUT /api/projects/:id
 * Updates an existing project
 */
apiRouter.put("/projects/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.update(id, updates);
    if (!updated) {
      return errorResponse(res, `Project with ID ${id} not found`, null, 404);
    }
    return successResponse(res, "Project updated successfully", updated);
  } catch (error) {
    return errorResponse(res, "Failed to update project", error);
  }
});

/**
 * DELETE /api/projects/:id
 * Deletes a project
 */
apiRouter.delete("/projects/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.delete(id);
    if (!deleted) {
      return errorResponse(res, `Project with ID ${id} not found`, null, 404);
    }
    return successResponse(res, "Project deleted successfully", { id });
  } catch (error) {
    return errorResponse(res, "Failed to delete project", error);
  }
});

/**
 * GET /api/dashboard/stats
 * Returns overall statistics for the dashboard
 */
apiRouter.get("/dashboard/stats", (req: Request, res: Response) => {
  try {
    const stats = db.getStats();
    return successResponse(res, "Dashboard stats fetched successfully", stats);
  } catch (error) {
    return errorResponse(res, "Failed to fetch dashboard stats", error);
  }
});
