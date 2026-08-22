export interface ProjectIdea {
  id: string;
  title: string;
  domain: string;
  problemStatement: string;
  description: string;
  objectives: string[];
  targetUsers: string[];
  technologiesRequired: string[];
  hardwareRequirements?: string[];
  softwareRequirements: string[];
  databaseRequirements: string[];
  aiMlAlgorithms?: string[];
  developmentModules: {
    name: string;
    description: string;
  }[];
  systemArchitectureExplanation: string;
  apiSuggestions: string[];
  estimatedDevelopmentTime: string;
  difficultyScore: number; // 1-10
  innovationScore: number; // 1-10
  scalabilitySuggestions: string[];
  futureEnhancements: string[];
  createdAt: string;
  // Optional attached data
  customFeatures?: string[];
  evaluation?: ProjectEvaluation;
  architecture?: SystemArchitecture;
  roadmap?: RoadmapPhase[];
  techStack?: TechStackRecommendation;
}

export interface ProjectEvaluation {
  innovationScore: number; // 1-100
  feasibilityScore: number; // 1-100
  usefulnessScore: number; // 1-100
  scalabilityScore: number; // 1-100
  complexityScore: number; // 1-100
  readinessScore: number; // 0-100
  estimatedCost: string;
  possibleChallenges: string[];
  securityConcerns: string[];
  missingFeatures: string[];
  keyStrengths: string[];
  recommendationSummary: string;
}

export interface RecommendedFeature {
  id: string;
  title: string;
  category: 'AI & ML' | 'IoT & Hardware' | 'Blockchain & Web3' | 'Realtime & Comms' | 'Security & Cloud' | 'User Experience';
  description: string;
  innovationBoost: number; // 1-10
  implementationComplexity: 'Low' | 'Medium' | 'High';
  technologies: string[];
  benefit: string;
}

export interface SystemArchitecture {
  layers: {
    layer: 'Frontend' | 'Backend' | 'REST APIs' | 'AI/ML Engine' | 'Database' | 'IoT / External Services';
    technologies: string[];
    description: string;
    components: string[];
    securityPractices: string[];
  }[];
  dataFlowDescription: string;
  infrastructureSuggestions: string[];
}

export interface RoadmapTask {
  id: string;
  title: string;
  duration: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dependencies: string[];
  completed: boolean;
  notes?: string;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  name: string;
  duration: string;
  description: string;
  tasks: RoadmapTask[];
}

export interface TechStackRecommendation {
  frontendFramework: { name: string; reason: string; alternatives: string[] };
  backendFramework: { name: string; reason: string; alternatives: string[] };
  database: { name: string; reason: string; alternatives: string[] };
  aiMlLibraries: { name: string; reason: string; alternatives: string[] };
  cloudPlatform: { name: string; reason: string; alternatives: string[] };
  authenticationSystem: { name: string; reason: string; alternatives: string[] };
  apiArchitecture: { name: string; reason: string; alternatives: string[] };
  deploymentPlatform: { name: string; reason: string; alternatives: string[] };
  overallRationale: string;
}

export interface DashboardStats {
  totalProjectsGenerated: number;
  totalProjectsEvaluated: number;
  averageInnovationScore: number;
  averageReadinessScore: number;
  mostSelectedTechnology: string;
  mostPopularDomain: string;
  domainDistribution: { [domain: string]: number };
  techDistribution: { [tech: string]: number };
  difficultyDistribution: { [level: string]: number };
  recentProjects: ProjectIdea[];
}
