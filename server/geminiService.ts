import { GoogleGenAI } from "@google/genai";
import {
  ProjectIdea,
  ProjectEvaluation,
  RecommendedFeature,
  SystemArchitecture,
  RoadmapPhase,
  TechStackRecommendation,
} from "../src/types/index.js";

const apiKey = process.env.GEMINI_API_KEY || "";

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

/**
 * Safely parse JSON from model output that may include Markdown formatting
 */
function cleanAndParseJSON<T>(text: string, fallback: T): T {
  try {
    let clean = text.trim();
    if (clean.startsWith("```json")) {
      clean = clean.substring(7);
    } else if (clean.startsWith("```")) {
      clean = clean.substring(3);
    }
    if (clean.endsWith("```")) {
      clean = clean.substring(0, clean.length - 3);
    }
    return JSON.parse(clean.trim()) as T;
  } catch (error) {
    console.error("Failed to parse Gemini JSON output:", error, "\nRaw text:", text);
    return fallback;
  }
}

/**
 * Feature 1: Generate 5 unique and practical project ideas
 */
export async function generateProjectIdeas(params: {
  domain: string;
  technologies: string[];
  difficulty: string; // e.g. "Beginner", "Intermediate", "Advanced"
  duration: string; // e.g. "2 Weeks", "1 Month", "3 Months", "6 Months"
  projectScope: string; // "Individual" or "Team"
  projectType: string; // e.g. "Full Stack", "AI/ML", "IoT", "Mobile", "Research", "Blockchain"
}): Promise<ProjectIdea[]> {
  const prompt = `
You are an expert AI Research Director and Principal Software Architect at the "AI Innovation Lab".
Generate exactly 5 innovative, practical, and highly engaging project ideas for students, developers, and researchers.

User Constraints:
- Domain: ${params.domain || "Artificial Intelligence"}
- Known / Preferred Technologies: ${params.technologies?.join(", ") || "Python, React, Node.js, TensorFlow"}
- Difficulty Level: ${params.difficulty || "Intermediate"}
- Target Duration: ${params.duration || "1-3 Months"}
- Project Scope: ${params.projectScope || "Individual"}
- Preferred Project Type: ${params.projectType || "Full-Stack AI Application"}

For EACH of the 5 projects, provide a complete detailed specification in valid JSON format matching this array structure:
[
  {
    "id": "proj-uuid-1",
    "title": "Clear catchy title",
    "domain": "${params.domain || "Artificial Intelligence"}",
    "problemStatement": "Precise real-world problem being solved",
    "description": "Comprehensive 2-3 sentence overview of how the solution works",
    "objectives": ["Objective 1", "Objective 2", "Objective 3"],
    "targetUsers": ["User group 1", "User group 2"],
    "technologiesRequired": ["Tech 1", "Tech 2", "Tech 3", "Tech 4"],
    "hardwareRequirements": ["Hardware 1 (if applicable or empty array)"],
    "softwareRequirements": ["Tool 1", "Tool 2", "IDE/OS"],
    "databaseRequirements": ["Database name and schema strategy"],
    "aiMlAlgorithms": ["Algorithm/Model 1", "Model 2"],
    "developmentModules": [
      { "name": "Module 1 Name", "description": "Module responsibility" },
      { "name": "Module 2 Name", "description": "Module responsibility" },
      { "name": "Module 3 Name", "description": "Module responsibility" }
    ],
    "systemArchitectureExplanation": "Clear technical breakdown of data flow and component interaction",
    "apiSuggestions": ["POST /api/predict", "GET /api/telemetry", "POST /api/sync"],
    "estimatedDevelopmentTime": "${params.duration || "2 Months"}",
    "difficultyScore": 7,
    "innovationScore": 9,
    "scalabilitySuggestions": ["Horizontal scaling idea", "Caching strategy"],
    "futureEnhancements": ["Phase 2 extension", "IoT bridge", "Agentic automation"],
    "createdAt": "${new Date().toISOString()}"
  }
]

Respond ONLY with valid JSON array without extraneous markdown.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "";
      const parsed = cleanAndParseJSON<ProjectIdea[]>(text, []);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => ({
          ...item,
          id: item.id || `proj-${Date.now()}-${idx + 1}`,
          createdAt: item.createdAt || new Date().toISOString(),
          difficultyScore: Math.min(10, Math.max(1, Number(item.difficultyScore) || 5)),
          innovationScore: Math.min(10, Math.max(1, Number(item.innovationScore) || 8)),
        }));
      }
    } catch (err) {
      console.error("Gemini project generation error:", err);
    }
  }

  // Fallback high quality ideas if API key is not yet set or unavailable
  return getFallbackIdeas(params);
}

/**
 * Feature 2: Evaluate a Project Idea
 */
export async function evaluateProjectIdea(project: {
  title: string;
  domain: string;
  description: string;
  technologies?: string[];
  targetUsers?: string;
  problemStatement?: string;
}): Promise<ProjectEvaluation> {
  const prompt = `
You are a senior venture evaluator and principal engineering director.
Evaluate the following project idea thoroughly:

Project Title: ${project.title}
Domain: ${project.domain}
Description: ${project.description}
Problem Statement: ${project.problemStatement || "Not specified"}
Key Technologies: ${project.technologies?.join(", ") || "Standard modern stack"}
Target Users: ${project.targetUsers || "General practitioners / developers"}

Evaluate this project across these criteria and return a valid JSON object:
{
  "innovationScore": 85, // 0 to 100
  "feasibilityScore": 78, // 0 to 100
  "usefulnessScore": 92, // 0 to 100
  "scalabilityScore": 80, // 0 to 100
  "complexityScore": 65, // 0 to 100
  "readinessScore": 84, // Overall weighted readiness score 0 to 100
  "estimatedCost": "$150 - $400 / month (Cloud infra & API quotas)",
  "possibleChallenges": [
    "Challenge 1 regarding latency or data privacy",
    "Challenge 2 regarding model drift or real-time concurrency",
    "Challenge 3 regarding hardware edge sync"
  ],
  "securityConcerns": [
    "API Key exposure & rate limiting",
    "Data encryption in transit & at rest",
    "OAuth token storage and session hygiene"
  ],
  "missingFeatures": [
    "Missing feature suggestion 1 for high impact",
    "Missing feature suggestion 2 for user retention",
    "Missing feature suggestion 3 for enterprise compliance"
  ],
  "keyStrengths": [
    "Strength 1",
    "Strength 2",
    "Strength 3"
  ],
  "recommendationSummary": "Concise 2-sentence verdict on how to take this project from prototype to production."
}

Return ONLY valid JSON.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          temperature: 0.5,
          responseMimeType: "application/json",
        },
      });
      const parsed = cleanAndParseJSON<ProjectEvaluation | null>(response.text || "", null);
      if (parsed && typeof parsed.readinessScore === "number") {
        return parsed;
      }
    } catch (err) {
      console.error("Gemini project evaluation error:", err);
    }
  }

  // Fallback evaluation
  return {
    innovationScore: 88,
    feasibilityScore: 82,
    usefulnessScore: 90,
    scalabilityScore: 85,
    complexityScore: 70,
    readinessScore: 85,
    estimatedCost: "$50 - $200 / month (Cloud compute & vector storage)",
    possibleChallenges: [
      "Real-time latency synchronization across edge devices",
      "Model inference optimization and cold-start mitigations",
      "Securing user authorization across distributed microservices",
    ],
    securityConcerns: [
      "Strict validation of client-supplied payloads to prevent prompt injection",
      "End-to-end encryption for sensitive health/financial metrics",
      "Zero-trust RBAC tokens with short-lived session lifetimes",
    ],
    missingFeatures: [
      "Autonomous background worker for automated trend anomaly alerts",
      "Exportable compliance audit log in PDF/CSV format",
      "Offline-first progressive web app caching for remote field technicians",
    ],
    keyStrengths: [
      "Strong product-market alignment solving acute operational friction",
      "Modular architectural boundaries enabling parallel team execution",
      "High scalability potential utilizing serverless compute layers",
    ],
    recommendationSummary:
      "The concept exhibits outstanding market feasibility and technical viability. Prioritize building the core AI pipeline and baseline UI in Phase 1 before scaling infrastructure.",
  };
}

/**
 * Feature 3: Recommend Advanced Features
 */
export async function recommendFeatures(project: {
  title: string;
  domain: string;
  description: string;
  technologies?: string[];
}): Promise<RecommendedFeature[]> {
  const prompt = `
You are an innovation catalyst engineer.
Given the project:
Title: ${project.title}
Domain: ${project.domain}
Description: ${project.description}
Current Stack: ${project.technologies?.join(", ") || "Full stack"}

Suggest 6 high-value, cutting-edge feature additions across these categories:
1. Agentic AI & Autonomous Workflows
2. IoT Sensors & Edge Intelligence
3. Real-Time Telemetry & WebSockets
4. Voice Control & Multimodal Vision
5. Blockchain & Verifiable Audit Trails
6. Predictive Analytics & RAG Chatbot

Return a valid JSON array:
[
  {
    "id": "feat-1",
    "title": "Feature Title",
    "category": "AI & ML", // Choose from: "AI & ML", "IoT & Hardware", "Blockchain & Web3", "Realtime & Comms", "Security & Cloud", "User Experience"
    "description": "2 sentences on how this feature elevates the project.",
    "innovationBoost": 9, // 1 to 10
    "implementationComplexity": "Medium", // "Low", "Medium", "High"
    "technologies": ["WebSockets", "FastAPI", "Redis Pub/Sub"],
    "benefit": "Why users will love this feature."
  }
]

Return ONLY the JSON array.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      });
      const parsed = cleanAndParseJSON<RecommendedFeature[]>(response.text || "", []);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((f, i) => ({
          ...f,
          id: f.id || `feat-${Date.now()}-${i}`,
        }));
      }
    } catch (err) {
      console.error("Gemini feature recommendation error:", err);
    }
  }

  return [
    {
      id: "feat-ai-agent",
      title: "Agentic AI Task Orchestrator",
      category: "AI & ML",
      description: "Deploys autonomous multi-step agents that diagnose anomalies and draft remediation action plans without human intervention.",
      innovationBoost: 10,
      implementationComplexity: "Medium",
      technologies: ["LangGraph", "Gemini 3.7 Flash", "Redis"],
      benefit: "Reduces manual response time by 80% through automated background diagnostics.",
    },
    {
      id: "feat-voice-cmd",
      title: "Hands-Free Voice Command & Audio Narration",
      category: "User Experience",
      description: "Natural language speech-to-intent engine allowing operators in field environments to execute commands hands-free.",
      innovationBoost: 8,
      implementationComplexity: "Low",
      technologies: ["Web Speech API", "Gemini TTS", "WebRTC"],
      benefit: "Enables seamless field operation and increases accessibility for multitasking users.",
    },
    {
      id: "feat-iot-edge",
      title: "Edge IoT Sensor Mesh with TinyML",
      category: "IoT & Hardware",
      description: "Low-power microcontroller nodes running TinyML quantized models for offline anomaly detection.",
      innovationBoost: 9,
      implementationComplexity: "High",
      technologies: ["ESP32", "TensorFlow Lite Micro", "MQTT Protocol"],
      benefit: "Provides 100% offline resilience and zero-latency local alert triggering.",
    },
    {
      id: "feat-rag-chat",
      title: "RAG Contextual Intelligence Assistant",
      category: "AI & ML",
      description: "Vector-embedded knowledge base allowing team members to query technical manuals, past incidents, and project specs.",
      innovationBoost: 8,
      implementationComplexity: "Medium",
      technologies: ["ChromaDB / Pinecone", "Gemini Embeddings", "FastAPI"],
      benefit: "Instant conversational access to deep project documentation.",
    },
    {
      id: "feat-realtime-collab",
      title: "Real-Time WebSocket Collaboration Room",
      category: "Realtime & Comms",
      description: "Live operational dashboard with multiplayer cursor presence, live video annotation, and instant telemetry push.",
      innovationBoost: 7,
      implementationComplexity: "Medium",
      technologies: ["Socket.io", "Redis Pub/Sub", "WebRTC"],
      benefit: "Allows cross-functional teams to debug and co-pilot critical decisions in real-time.",
    },
    {
      id: "feat-blockchain-audit",
      title: "Immutable Cryptographic Audit Trail",
      category: "Blockchain & Web3",
      description: "Stores state transitions and verification hashes on a tamper-proof ledger for strict regulatory compliance.",
      innovationBoost: 8,
      implementationComplexity: "High",
      technologies: ["Solidity", "Polygon / Arbitrum L2", "Ethers.js"],
      benefit: "Guarantees irrefutable proof-of-authenticity for safety inspections and research records.",
    },
  ];
}

/**
 * Feature 4: Generate System Architecture
 */
export async function generateArchitecture(project: {
  title: string;
  domain: string;
  description: string;
  technologies?: string[];
}): Promise<SystemArchitecture> {
  const prompt = `
You are a Principal Cloud & Systems Architect.
Design a robust, modern, production-grade 6-tier system architecture for:

Project Title: ${project.title}
Domain: ${project.domain}
Description: ${project.description}
Stack: ${project.technologies?.join(", ") || "Modern Stack"}

Return a structured JSON object representing the 6 architectural tiers:
1. Frontend Layer
2. Backend Layer
3. REST APIs & Gateway
4. AI/ML Engine
5. Database & Storage Layer
6. IoT / External Services Layer

JSON Schema:
{
  "layers": [
    {
      "layer": "Frontend",
      "technologies": ["React 19", "Tailwind CSS", "Chart.js"],
      "description": "Single-page responsive dashboard providing live visual feedback...",
      "components": ["State Store", "Chart Canvas Engine", "Auth Client Guard"],
      "securityPractices": ["CSP Headers", "XSS sanitization", "Token storage in memory/secure cookies"]
    },
    {
      "layer": "Backend",
      "technologies": ["Node.js / Express or Python FastAPI"],
      "description": "Handles business logic, orchestration, and request dispatch...",
      "components": ["Session Validator", "Event Dispatcher", "Worker Queue"],
      "securityPractices": ["JWT verification", "Rate limiting", "Input schema validation"]
    },
    {
      "layer": "REST APIs",
      "technologies": ["OpenAPI 3.1", "JSON Schema"],
      "description": "Standardized RESTful interfaces exposing project workflows...",
      "components": ["/api/v1/projects", "/api/v1/telemetry", "/api/v1/ai"],
      "securityPractices": ["API Key authentication", "CORS policy enforcement"]
    },
    {
      "layer": "AI/ML Engine",
      "technologies": ["Gemini 3.7 Flash", "PyTorch / TensorFlow", "Vector Store"],
      "description": "Processes domain inference, model evaluation, and embedding search...",
      "components": ["Prompt Pipeline", "Inference Runner", "Cache Layer"],
      "securityPractices": ["Prompt injection sanitization", "PII redaction"]
    },
    {
      "layer": "Database",
      "technologies": ["PostgreSQL / SQLite", "Redis Cache"],
      "description": "Relational data persistence for projects, roadmaps, and caching...",
      "components": ["Relational Tables", "Index Pools", "Write-ahead logging"],
      "securityPractices": ["Encrypted at rest", "Parameterized queries", "Automated backups"]
    },
    {
      "layer": "IoT / External Services",
      "technologies": ["MQTT Broker", "Webhooks", "Third-party APIs"],
      "description": "Bridges external hardware sensors, notification gateways, and cloud webhooks...",
      "components": ["Telemetry Ingestion", "Webhook Dispatcher", "Cloud Pub/Sub"],
      "securityPractices": ["TLS 1.3 mutual auth", "HMAC signature verification"]
    }
  ],
  "dataFlowDescription": "Detailed 3-sentence summary of how data flows from user input or sensor event down to persistence and AI inference.",
  "infrastructureSuggestions": ["Docker containerization", "Kubernetes / Cloud Run deployment", "CDN Edge Caching"]
}

Return ONLY valid JSON.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      });
      const parsed = cleanAndParseJSON<SystemArchitecture | null>(response.text || "", null);
      if (parsed && Array.isArray(parsed.layers) && parsed.layers.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.error("Gemini architecture generator error:", err);
    }
  }

  return {
    layers: [
      {
        layer: "Frontend",
        technologies: ["React 19 / Bootstrap 5", "Chart.js", "Lucide Icons", "Vite"],
        description: "Interactive single-page client interface offering dynamic dashboards, real-time analytics graphs, and interactive forms.",
        components: ["Dashboard Views", "Visual Architecture Canvas", "Roadmap Interactive Checkers", "Export Engine"],
        securityPractices: ["CSP Headers", "Strict XSS Escaping", "Sanitized HTML Rendering"],
      },
      {
        layer: "Backend",
        technologies: ["Python Flask / Express.js", "TypeScript / Python 3.11"],
        description: "Robust asynchronous application server orchestrating business logic, security middleware, and task queues.",
        components: ["Auth Validator", "Project Service", "Analytics Pipeline", "Gemini Controller"],
        securityPractices: ["Strict CORS Policies", "Rate Limiter per IP", "Input Schema Validation"],
      },
      {
        layer: "REST APIs",
        technologies: ["RESTful JSON API", "OpenAPI Specification"],
        description: "Stateless HTTP/2 endpoints facilitating seamless data exchange across client apps and microservices.",
        components: ["/api/projects/generate", "/api/projects/evaluate", "/api/projects/roadmap", "/api/dashboard/stats"],
        securityPractices: ["Bearer Token Authentication", "Standardized Error Wrappers", "Payload Size Limits"],
      },
      {
        layer: "AI/ML Engine",
        technologies: ["Google Gemini 3.7 Flash", "@google/genai SDK", "Vector Embeddings"],
        description: "Intelligent cognitive layer generating project hypotheses, scoring readiness, and recommending technical architectures.",
        components: ["Prompt Engineering Engine", "Structured JSON Parser", "Fallback Heuristics", "Model Response Cache"],
        securityPractices: ["Prompt Injection Shield", "Server-Side Key Isolation", "Sanitized Model Output"],
      },
      {
        layer: "Database",
        technologies: ["SQLite (Local)", "PostgreSQL (Production)", "Redis (Caching)"],
        description: "ACID-compliant relational storage storing project definitions, evaluations, roadmap tasks, and user telemetry.",
        components: ["Projects Table", "Evaluations Table", "Roadmap Tasks Table", "Analytics Indices"],
        securityPractices: ["Parameterized SQL Statements", "AES-256 Encryption at Rest", "Automated WAL Backups"],
      },
      {
        layer: "IoT / External Services",
        technologies: ["MQTT Protocol", "ESP32 Sensor Bridges", "Cloud Webhooks"],
        description: "Hardware telemetry ingestion gateway and external third-party service connectors.",
        components: ["Sensor Ingestion Broker", "Push Notification Gateway", "Cloud Storage Sync"],
        securityPractices: ["TLS 1.3 Device Certificates", "HMAC Payload Verification", "Replay Attack Nonces"],
      },
    ],
    dataFlowDescription:
      "Client requests enter through the REST API layer, validated by Backend middleware. Requests requiring AI insight are processed by the Gemini 3.7 Engine and cached in SQLite/PostgreSQL before returning structured JSON to the reactive Frontend layer.",
    infrastructureSuggestions: [
      "Containerize microservices with Docker multi-stage builds",
      "Deploy on Google Cloud Run or AWS ECS with automated scale-to-zero",
      "Utilize Cloudflare CDN for edge asset distribution",
    ],
  };
}

/**
 * Feature 5: Development Roadmap Generator
 */
export async function generateRoadmap(project: {
  title: string;
  domain: string;
  description: string;
  estimatedDevelopmentTime?: string;
}): Promise<RoadmapPhase[]> {
  const prompt = `
You are a Principal Engineering Project Manager.
Create an 8-phase actionable engineering roadmap for:

Project: ${project.title}
Domain: ${project.domain}
Description: ${project.description}
Target Timeline: ${project.estimatedDevelopmentTime || "2 Months"}

Generate 8 phases strictly:
Phase 1: Requirement Analysis & Feasibility
Phase 2: UI/UX Wireframing & Prototyping
Phase 3: Database & Schema Design
Phase 4: Backend API & Core Architecture
Phase 5: AI/ML Model Training & API Integration
Phase 6: Frontend Integration & State Flow
Phase 7: Testing, QA & Security Audits
Phase 8: Production Deployment & Monitoring

For each phase, provide 3-4 concrete actionable tasks with priority, duration, dependencies, and completed: false.

Return a valid JSON array matching this format:
[
  {
    "id": "phase-1",
    "phaseNumber": 1,
    "name": "Phase 1: Requirement Analysis & Feasibility",
    "duration": "1 Week",
    "description": "Define scope, key user personas, hardware/software constraints, and API contracts.",
    "tasks": [
      {
        "id": "task-1-1",
        "title": "Document functional and non-functional requirements",
        "duration": "2 Days",
        "priority": "Critical",
        "dependencies": [],
        "completed": false,
        "notes": "Include data compliance guidelines"
      },
      {
        "id": "task-1-2",
        "title": "Formulate AI prompt strategies and model benchmarks",
        "duration": "3 Days",
        "priority": "High",
        "dependencies": ["task-1-1"],
        "completed": false
      }
    ]
  }
]

Return ONLY the JSON array.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          temperature: 0.5,
          responseMimeType: "application/json",
        },
      });
      const parsed = cleanAndParseJSON<RoadmapPhase[]>(response.text || "", []);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.error("Gemini roadmap generator error:", err);
    }
  }

  return getDefaultRoadmap(project.title);
}

/**
 * Feature 6: AI Tech Stack Advisor
 */
export async function recommendTechStack(project: {
  title: string;
  domain: string;
  description: string;
  teamSize?: string;
  experienceLevel?: string;
}): Promise<TechStackRecommendation> {
  const prompt = `
You are a Chief Technology Officer (CTO).
Recommend the optimal technology stack for building:

Project Title: ${project.title}
Domain: ${project.domain}
Description: ${project.description}
Team Size / Experience: ${project.teamSize || "Solo / Intermediate"}

Recommend the best choices for:
1. Frontend Framework
2. Backend Framework
3. Database System
4. AI/ML Libraries
5. Cloud Platform
6. Authentication System
7. API Architecture
8. Deployment & CI/CD Platform

For EVERY recommendation, explain WHY it was chosen and list 2 viable alternative technologies.

JSON Schema:
{
  "frontendFramework": { "name": "React with Vite & Tailwind", "reason": "Offers blazing fast hot reloading and modular UI ecosystem.", "alternatives": ["Vue 3 + Nuxt", "Next.js"] },
  "backendFramework": { "name": "FastAPI / Python", "reason": "Native async support and seamless integration with ML libraries.", "alternatives": ["Express.js (Node.js)", "Go Gin"] },
  "database": { "name": "PostgreSQL with pgvector", "reason": "Combines rock-solid ACID transactions with native vector embedding search.", "alternatives": ["SQLite", "MongoDB"] },
  "aiMlLibraries": { "name": "Google GenAI SDK & LangChain", "reason": "Direct access to state-of-the-art Gemini 3.7 models with low latency.", "alternatives": ["HuggingFace Transformers", "Ollama"] },
  "cloudPlatform": { "name": "Google Cloud Platform", "reason": "Superior AI infrastructure and serverless Cloud Run scaling.", "alternatives": ["AWS", "Vercel + Supabase"] },
  "authenticationSystem": { "name": "Firebase Auth / Auth0", "reason": "Turnkey OAuth2, JWT verification, and RBAC support.", "alternatives": ["NextAuth", "Supabase Auth"] },
  "apiArchitecture": { "name": "RESTful OpenAPI + Server-Sent Events", "reason": "Standardized CRUD endpoints with streaming capabilities for AI tokens.", "alternatives": ["GraphQL", "gRPC"] },
  "deploymentPlatform": { "name": "Docker on Google Cloud Run", "reason": "Zero-maintenance scale-to-zero serverless container orchestration.", "alternatives": ["AWS App Runner", "Fly.io"] },
  "overallRationale": "This stack provides maximum developer velocity, low idle hosting costs, and effortless scaling for AI workloads."
}

Return ONLY valid JSON.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          temperature: 0.5,
          responseMimeType: "application/json",
        },
      });
      const parsed = cleanAndParseJSON<TechStackRecommendation | null>(response.text || "", null);
      if (parsed && parsed.frontendFramework && parsed.backendFramework) {
        return parsed;
      }
    } catch (err) {
      console.error("Gemini tech stack advisor error:", err);
    }
  }

  return {
    frontendFramework: {
      name: "React 19 + TypeScript + Tailwind CSS",
      reason: "Provides reactive state management, high performance, and rapid UI development with responsive design.",
      alternatives: ["Vue 3 + Vite", "Next.js App Router"],
    },
    backendFramework: {
      name: "Python Flask / FastAPI or Node.js Express",
      reason: "Lightweight, highly modular architecture that enables clean separation of routes, services, and AI controllers.",
      alternatives: ["Django REST Framework", "Go Fiber"],
    },
    database: {
      name: "SQLite for Dev / PostgreSQL for Prod",
      reason: "Zero-config setup for development that seamlessly migrates to PostgreSQL with relational integrity and vector index support.",
      alternatives: ["MongoDB", "Supabase PostgreSQL"],
    },
    aiMlLibraries: {
      name: "@google/genai SDK (Gemini 3.7 Flash) & Scikit-learn",
      reason: "Ultra-fast response latency, exceptional multimodal comprehension, and robust structured JSON mode.",
      alternatives: ["Hugging Face Transformers", "TensorFlow Lite"],
    },
    cloudPlatform: {
      name: "Google Cloud Platform (Cloud Run)",
      reason: "Serverless container execution that scales down to zero cost during idle periods while providing instant concurrency.",
      alternatives: ["AWS Lambda / ECS", "Render / Railway"],
    },
    authenticationSystem: {
      name: "JWT Bearer Tokens with Bcrypt / Firebase Auth",
      reason: "Stateless, secure session validation across both web and mobile clients.",
      alternatives: ["Auth0", "OAuth2 / Social Logins"],
    },
    apiArchitecture: {
      name: "REST API with JSON Schema Validation",
      reason: "Predictable HTTP verbs, universal compatibility with client frameworks, and straightforward API caching.",
      alternatives: ["GraphQL", "gRPC Protocol Buffers"],
    },
    deploymentPlatform: {
      name: "Docker Containerized CI/CD",
      reason: "Ensures identical environments between local developer machines and cloud deployment clusters.",
      alternatives: ["Vercel", "DigitalOcean App Platform"],
    },
    overallRationale:
      "This architecture prioritizes rapid prototyping speed, deterministic performance, and zero-headache cloud migration path.",
  };
}

/**
 * Fallback idea generator for instant testing
 */
function getFallbackIdeas(params: {
  domain: string;
  technologies: string[];
  difficulty: string;
  duration: string;
  projectScope: string;
  projectType: string;
}): ProjectIdea[] {
  const domain = params.domain || "Artificial Intelligence";
  const now = new Date().toISOString();

  return [
    {
      id: `proj-${Date.now()}-1`,
      title: `${domain} Autonomous Diagnostic & Triage Copilot`,
      domain: domain,
      problemStatement:
        "Field specialists and practitioners struggle with delayed anomaly detection and manual record synthesis under high operational workloads.",
      description:
        "A multimodal AI platform that ingests telemetry, audio notes, and sensor logs to instantly detect critical patterns, generate triage summaries, and recommend corrective interventions.",
      objectives: [
        "Automate multi-stream anomaly detection with 95%+ precision",
        "Generate human-verifiable diagnostic reports in under 3 seconds",
        "Provide interactive natural language query over historic logs",
      ],
      targetUsers: ["Domain Practitioners", "Field Engineers", "Research Analysts"],
      technologiesRequired: ["Python", "FastAPI", "React", "Gemini 3.7 Flash", "Tailwind CSS"],
      hardwareRequirements: ["Optional: Raspberry Pi 4 / ESP32 Sensor Hub"],
      softwareRequirements: ["Python 3.11+", "Node.js 20+", "Docker"],
      databaseRequirements: ["SQLite for local storage, migrating to PostgreSQL with pgvector"],
      aiMlAlgorithms: ["Transformer Attention", "Gemini Multi-turn Reasoning", "Cosine Similarity Search"],
      developmentModules: [
        { name: "Ingestion Gateway", description: "Collects and parses multi-format logs and inputs" },
        { name: "Inference & Reasoning Pipeline", description: "Applies Gemini 3.7 models to diagnose root causes" },
        { name: "Interactive Visualizer", description: "Displays dynamic charts, risk scores, and audit reports" },
      ],
      systemArchitectureExplanation:
        "Frontend renders reactive dashboards and Chart.js graphs. Express/FastAPI backend handles session state and invokes Gemini 3.7 Flash for structured reasoning, storing audit snapshots in SQLite.",
      apiSuggestions: [
        "POST /api/diagnostics/analyze",
        "GET /api/diagnostics/reports",
        "POST /api/diagnostics/export",
      ],
      estimatedDevelopmentTime: params.duration || "1-2 Months",
      difficultyScore: 7,
      innovationScore: 9,
      scalabilitySuggestions: [
        "Implement Redis caching for recurring diagnostic queries",
        "Deploy backend workers on serverless Cloud Run with auto-concurrency",
      ],
      futureEnhancements: [
        "Hands-free voice commanding via Gemini Live API",
        "Offline-first TinyML quantization for edge devices",
      ],
      createdAt: now,
    },
    {
      id: `proj-${Date.now()}-2`,
      title: `Intelligent Edge IoT Environmental Guardian`,
      domain: "IoT & Smart Systems",
      problemStatement:
        "Urban and agricultural environments lack affordable, real-time microclimate monitoring and predictive hazard prevention.",
      description:
        "An IoT sensor mesh connected to an AI telemetry processor that forecasts environmental degradation, air quality drops, and water stress days before thresholds are breached.",
      objectives: [
        "Deploy low-cost ESP32 microcontrollers with I2C sensor clusters",
        "Train predictive regression models for 48-hour climate forecasting",
        "Trigger instant emergency alerts via WebPush and SMS",
      ],
      targetUsers: ["Smart City Managers", "Precision Farmers", "Campus Facility Teams"],
      technologiesRequired: ["C++ / Arduino", "Node.js", "MQTT Broker", "React", "Chart.js"],
      hardwareRequirements: ["ESP32 Dev Module", "DHT22 Sensor", "MQ-135 Gas Sensor", "OLED Display"],
      softwareRequirements: ["Mosquitto MQTT", "VS Code PlatformIO", "SQLite"],
      databaseRequirements: ["Time-series optimized relational tables with time-bucketing"],
      aiMlAlgorithms: ["LSTM Time-Series Forecasting", "Random Forest Regressor"],
      developmentModules: [
        { name: "Firmware Node", description: "Samples sensors and publishes JSON payloads over MQTT" },
        { name: "Telemetry Broker & Alert Daemon", description: "Aggregates feeds and runs threshold alerts" },
        { name: "Map & Gauge Dashboard", description: "Visualizes sensor clusters on an interactive geospatial canvas" },
      ],
      systemArchitectureExplanation:
        "ESP32 nodes transmit sensor readings over MQTT/TLS to a central broker. The backend stores time-series metrics in SQLite and uses Gemini for anomaly synthesis, rendered dynamically on Chart.js visualizers.",
      apiSuggestions: ["POST /api/telemetry/record", "GET /api/telemetry/live", "GET /api/hazards/forecast"],
      estimatedDevelopmentTime: params.duration || "2 Months",
      difficultyScore: 6,
      innovationScore: 8,
      scalabilitySuggestions: [
        "Partition time-series data monthly to keep query execution sub-10ms",
        "Use MQTT QoS-1 for reliable delivery across unstable cellular connections",
      ],
      futureEnhancements: [
        "Solar-powered energy harvesting unit",
        "LoRaWAN mesh for long-distance 10km rural coverage",
      ],
      createdAt: now,
    },
    {
      id: `proj-${Date.now()}-3`,
      title: `Zero-Knowledge Blockchain Credential & IP Registry`,
      domain: "Blockchain & Cybersecurity",
      problemStatement:
        "Academic certificates, software licensing, and digital research IP suffer from rampant forgery and centralized verification bottlenecks.",
      description:
        "A decentralized verification portal allowing universities and research institutes to mint verifiable credentials and timestamp patents with Zero-Knowledge proof verification.",
      objectives: [
        "Enable one-click cryptographic issuance of tamper-proof certificates",
        "Verify credentials in under 200ms without exposing private student records",
        "Provide universal QR code verification for employers and reviewers",
      ],
      targetUsers: ["Universities", "Certification Authorities", "Independent Researchers"],
      technologiesRequired: ["Solidity", "Ethers.js", "React", "Express.js", "IPFS / Arweave"],
      hardwareRequirements: ["None (Cloud/Browser Web3)"],
      softwareRequirements: ["Hardhat / Foundry", "MetaMask", "Node.js"],
      databaseRequirements: ["SQLite cache for fast indexing + Polygon smart contracts for on-chain state"],
      aiMlAlgorithms: ["Merkle Tree Hash Verification", "AI Document OCR & Signature Extraction"],
      developmentModules: [
        { name: "Smart Contract Suite", description: "ERC-721 / soulbound token minting and revocation" },
        { name: "Issuance Portal", description: "Batch CSV uploader and cryptographic key signer" },
        { name: "Public Verification Widget", description: "Instant drag-and-drop certificate validator" },
      ],
      systemArchitectureExplanation:
        "Issuers upload credentials to IPFS. Hashes are anchored onto EVM contracts. The React frontend verifies cryptographic signatures directly against the blockchain without centralized dependencies.",
      apiSuggestions: ["POST /api/credentials/mint", "GET /api/credentials/verify/:hash", "GET /api/issuer/stats"],
      estimatedDevelopmentTime: params.duration || "2-3 Months",
      difficultyScore: 8,
      innovationScore: 9,
      scalabilitySuggestions: [
        "Utilize Layer-2 rollups (Arbitrum/Base) to reduce gas fees to under $0.01 per certificate",
      ],
      futureEnhancements: [
        "Soulbound non-transferable token standard integration",
        "Decentralized Identity (DID) standard compliance (W3C)",
      ],
      createdAt: now,
    },
    {
      id: `proj-${Date.now()}-4`,
      title: `Adaptive AI Code Reviewer & Security Vulnerability Healer`,
      domain: "Software Engineering & DevSecOps",
      problemStatement:
        "Junior engineers frequently push subtle concurrency bugs, SQL injection flaws, and memory leaks that escape conventional static linters.",
      description:
        "An AI-powered GitHub/GitLab assistant that reads pull requests, computes complexity graphs, identifies architectural smells, and automatically proposes pull request diff patches.",
      objectives: [
        "Detect OWASP Top 10 vulnerabilities with contextual AST understanding",
        "Generate ready-to-merge git diff fixes with explanation comments",
        "Benchmark algorithmic time/space complexity per commit",
      ],
      targetUsers: ["Engineering Leads", "Open Source Maintainers", "Computer Science Students"],
      technologiesRequired: ["TypeScript", "Node.js", "Docker", "Gemini 3.7 Flash", "GitHub Webhooks API"],
      hardwareRequirements: ["None"],
      softwareRequirements: ["Docker Engine", "Git 2.40+"],
      databaseRequirements: ["SQLite for PR analysis history and team metrics"],
      aiMlAlgorithms: ["AST Semantic Tree Graphing", "Gemini Contextual Code Healing"],
      developmentModules: [
        { name: "Git Webhook Receiver", description: "Listens for PR open/sync events and pulls code diffs" },
        { name: "Security & Quality Analyzer", description: "Scans diffs against AST patterns and AI heuristics" },
        { name: "Diff Generator & Bot Commenter", description: "Posts inline GitHub review comments and suggested fixes" },
      ],
      systemArchitectureExplanation:
        "GitHub webhooks notify the Express backend. The backend checks out PR diffs, executes containerized AST analysis, prompts Gemini 3.7 for patch generation, and returns inline review comments.",
      apiSuggestions: ["POST /api/github/webhook", "POST /api/review/manual", "GET /api/metrics/vulns"],
      estimatedDevelopmentTime: params.duration || "1 Month",
      difficultyScore: 7,
      innovationScore: 9,
      scalabilitySuggestions: [
        "Queue incoming webhook bursts via BullMQ or Redis stream worker pool",
      ],
      futureEnhancements: [
        "Automated regression test synthesis for newly created bug patches",
        "IDE extension for VS Code and JetBrains",
      ],
      createdAt: now,
    },
    {
      id: `proj-${Date.now()}-5`,
      title: `Vision-Augmented Smart Retail & Cashierless Checkout`,
      domain: "Computer Vision & Edge Computing",
      problemStatement:
        "Physical retail checkout lines cause high customer friction, abandoned carts, and significant staffing overhead.",
      description:
        "A multi-camera computer vision system that tracks customer item pickups, updates virtual shopping carts in real time, and completes automatic digital invoicing upon store exit.",
      objectives: [
        "Track customer interactions with shelf items with 98% accuracy",
        "Generate real-time itemized digital carts synced to mobile devices",
        "Eliminate checkout queues completely",
      ],
      targetUsers: ["Retail Chain Operators", "Campus Convenience Stores", "Shoppers"],
      technologiesRequired: ["Python", "OpenCV", "YOLOv8", "FastAPI", "React Mobile Web"],
      hardwareRequirements: ["Overhead RGB-D Depth Cameras / USB Webcams", "NVIDIA Jetson Nano or GPU workstation"],
      softwareRequirements: ["CUDA Toolkit", "PyTorch", "Redis PubSub"],
      databaseRequirements: ["SQLite/PostgreSQL inventory & transaction ledger"],
      aiMlAlgorithms: ["DeepSORT Object Tracking", "YOLOv8 Custom Object Detection", "Optical Flow"],
      developmentModules: [
        { name: "Vision Tracking Engine", description: "Performs real-time multi-person tracking and shelf interaction" },
        { name: "Cart Aggregator", description: "Maintains live cart state per person ID" },
        { name: "Payment & Receipt Dispatcher", description: "Charges registered card and delivers receipt on exit" },
      ],
      systemArchitectureExplanation:
        "Camera video streams are analyzed by the OpenCV/YOLO inference engine. State changes trigger Redis events to the backend, updating the customer's reactive web cart in real time.",
      apiSuggestions: ["POST /api/vision/frame", "GET /api/cart/:userId", "POST /api/checkout/finalize"],
      estimatedDevelopmentTime: params.duration || "3 Months",
      difficultyScore: 9,
      innovationScore: 10,
      scalabilitySuggestions: [
        "Offload edge tracking to on-premise Jetson devices, transmitting only lightweight event JSON to cloud",
      ],
      futureEnhancements: [
        "Smart shelf weight-sensor fusion for ultra-precise micro-item recognition",
        "Loss prevention anti-theft anomaly classifier",
      ],
      createdAt: now,
    },
  ];
}

function getDefaultRoadmap(projectTitle: string): RoadmapPhase[] {
  return [
    {
      id: "phase-1",
      phaseNumber: 1,
      name: "Phase 1: Requirement Analysis",
      duration: "1 Week",
      description: "Define core product specifications, target personas, technical boundaries, and system goals.",
      tasks: [
        { id: "t1-1", title: "Document functional requirements & user stories", duration: "2 Days", priority: "Critical", dependencies: [], completed: false },
        { id: "t1-2", title: "Conduct technical feasibility & API cost estimation", duration: "2 Days", priority: "High", dependencies: ["t1-1"], completed: false },
        { id: "t1-3", title: "Establish Git repository and branch protection rules", duration: "1 Day", priority: "Medium", dependencies: [], completed: false },
      ],
    },
    {
      id: "phase-2",
      phaseNumber: 2,
      name: "Phase 2: UI/UX Design & Prototyping",
      duration: "1-2 Weeks",
      description: "Create design system, interactive wireframes, and responsive user journey flows.",
      tasks: [
        { id: "t2-1", title: "Design component layout wireframes and typography hierarchy", duration: "3 Days", priority: "High", dependencies: ["t1-1"], completed: false },
        { id: "t2-2", title: "Build clickable high-fidelity prototype in Figma/React", duration: "4 Days", priority: "Medium", dependencies: ["t2-1"], completed: false },
        { id: "t2-3", title: "Review UX accessibility and mobile viewport responsiveness", duration: "2 Days", priority: "Low", dependencies: ["t2-2"], completed: false },
      ],
    },
    {
      id: "phase-3",
      phaseNumber: 3,
      name: "Phase 3: Database & Schema Design",
      duration: "1 Week",
      description: "Design relational models, indexing strategies, migrations, and caching layers.",
      tasks: [
        { id: "t3-1", title: "Author relational database schema with foreign keys and indexes", duration: "2 Days", priority: "Critical", dependencies: ["t1-1"], completed: false },
        { id: "t3-2", title: "Configure SQLite/PostgreSQL connection pools and migrations", duration: "2 Days", priority: "High", dependencies: ["t3-1"], completed: false },
        { id: "t3-3", title: "Implement seed scripts with realistic mock datasets", duration: "1 Day", priority: "Medium", dependencies: ["t3-2"], completed: false },
      ],
    },
    {
      id: "phase-4",
      phaseNumber: 4,
      name: "Phase 4: Backend API Development",
      duration: "2 Weeks",
      description: "Implement REST endpoints, authentication middleware, and business logic services.",
      tasks: [
        { id: "t4-1", title: "Implement RESTful controller routes with OpenAPI specs", duration: "4 Days", priority: "Critical", dependencies: ["t3-2"], completed: false },
        { id: "t4-2", title: "Add JWT / Session security middleware and rate limiters", duration: "3 Days", priority: "High", dependencies: ["t4-1"], completed: false },
        { id: "t4-3", title: "Develop asynchronous worker queues for long-running jobs", duration: "3 Days", priority: "Medium", dependencies: ["t4-1"], completed: false },
      ],
    },
    {
      id: "phase-5",
      phaseNumber: 5,
      name: "Phase 5: AI/ML Integration",
      duration: "1-2 Weeks",
      description: "Integrate Gemini 3.7 Flash SDK, prompt pipelines, vector stores, and fallback handlers.",
      tasks: [
        { id: "t5-1", title: "Configure @google/genai client with robust error wrapping", duration: "2 Days", priority: "Critical", dependencies: ["t4-1"], completed: false },
        { id: "t5-2", title: "Implement structured JSON response schemas and prompt templates", duration: "4 Days", priority: "High", dependencies: ["t5-1"], completed: false },
        { id: "t5-3", title: "Add response caching layer to minimize model latency and quota usage", duration: "2 Days", priority: "Medium", dependencies: ["t5-2"], completed: false },
      ],
    },
    {
      id: "phase-6",
      phaseNumber: 6,
      name: "Phase 6: Frontend Integration & State Flow",
      duration: "2 Weeks",
      description: "Connect React/Bootstrap UI to backend REST endpoints with live data charts.",
      tasks: [
        { id: "t6-1", title: "Build reactive API client layer with loading/error states", duration: "3 Days", priority: "High", dependencies: ["t4-1", "t5-2"], completed: false },
        { id: "t6-2", title: "Integrate Chart.js graphs for radar/bar score visualizations", duration: "3 Days", priority: "Medium", dependencies: ["t6-1"], completed: false },
        { id: "t6-3", title: "Implement client-side export to JSON, Markdown, and print reports", duration: "2 Days", priority: "Low", dependencies: ["t6-2"], completed: false },
      ],
    },
    {
      id: "phase-7",
      phaseNumber: 7,
      name: "Phase 7: Testing & Quality Assurance",
      duration: "1 Week",
      description: "Conduct unit testing, API integration testing, security audit, and load benchmarks.",
      tasks: [
        { id: "t7-1", title: "Write automated unit tests for core services and validators", duration: "3 Days", priority: "High", dependencies: ["t6-1"], completed: false },
        { id: "t7-2", title: "Perform security audit (CORS, prompt sanitization, rate limits)", duration: "2 Days", priority: "Critical", dependencies: ["t7-1"], completed: false },
        { id: "t7-3", title: "Conduct end-to-end user testing across multiple viewports", duration: "2 Days", priority: "Medium", dependencies: ["t7-2"], completed: false },
      ],
    },
    {
      id: "phase-8",
      phaseNumber: 8,
      name: "Phase 8: Production Deployment & Monitoring",
      duration: "1 Week",
      description: "Deploy to cloud hosting, configure environment variables, telemetry, and docs.",
      tasks: [
        { id: "t8-1", title: "Build production Docker container image with optimized layers", duration: "2 Days", priority: "High", dependencies: ["t7-2"], completed: false },
        { id: "t8-2", title: "Deploy to Cloud Run / Render and verify live environment variables", duration: "1 Day", priority: "Critical", dependencies: ["t8-1"], completed: false },
        { id: "t8-3", title: "Publish README, API documentation, and architecture diagrams", duration: "2 Days", priority: "Medium", dependencies: ["t8-2"], completed: false },
      ],
    },
  ];
}
