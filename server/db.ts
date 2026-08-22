import fs from "fs";
import path from "path";
import { ProjectIdea, DashboardStats } from "../src/types/index.js";

const DATA_DIR = path.resolve(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "projects.json");

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed projects to provide immediate rich data on first launch
const SEED_PROJECTS: ProjectIdea[] = [
  {
    id: "seed-proj-1",
    title: "NeuroPulse: EEG-Driven Brain-Computer Interface for Mobility Assistance",
    domain: "Artificial Intelligence",
    problemStatement:
      "Individuals with severe motor impairments lack affordable, responsive assistive interfaces to control smart wheelchairs and communication aids.",
    description:
      "An open-source non-invasive EEG headband and real-time deep learning classification pipeline that translates neural motor imagery waves into robotic navigation commands.",
    objectives: [
      "Decode P300 and SSVEP brain signals with 92%+ classification accuracy in under 150ms",
      "Bridge neural intent directly with wheelchair microcontrollers via BLE",
      "Provide a lightweight visual speller keyboard for hands-free typing",
    ],
    targetUsers: ["ALS & Stroke Patients", "Assistive Robotics Researchers", "Biomedical Engineers"],
    technologiesRequired: ["Python", "PyTorch", "OpenBCI Cyton", "FastAPI", "React", "WebSockets"],
    hardwareRequirements: ["OpenBCI Cyton 8-channel EEG Board", "Dry Electrode Cap", "ESP32 Motor Controller"],
    softwareRequirements: ["Python 3.11", "BrainFlow SDK", "Docker"],
    databaseRequirements: ["SQLite for user calibration profiles and session metrics"],
    aiMlAlgorithms: ["Temporal Convolutional Networks (TCN)", "Common Spatial Pattern (CSP) Filter"],
    developmentModules: [
      { name: "Raw Signal Ingestion", description: "Bessel bandpass filtering (0.5-50Hz) and artifact rejection" },
      { name: "Deep Neural Decoder", description: "Real-time inference on streaming 2-second signal windows" },
      { name: "Assistive Control Interface", description: "React dashboard showing live brainwave telemetry and vehicle status" },
    ],
    systemArchitectureExplanation:
      "EEG electrodes capture microvolt potentials; OpenBCI streams via Bluetooth to the FastAPI processing daemon. Processed vectors are classified by PyTorch, firing low-latency actuation commands to the robotic chassis.",
    apiSuggestions: ["GET /api/bci/stream", "POST /api/bci/calibrate", "GET /api/bci/diagnostics"],
    estimatedDevelopmentTime: "3 Months",
    difficultyScore: 9,
    innovationScore: 10,
    scalabilitySuggestions: [
      "Quantize PyTorch model using ONNX Runtime for edge deployment on Raspberry Pi 5",
      "Implement federated learning to continuously refine classification weights across patient cohorts",
    ],
    futureEnhancements: [
      "Generative voice synthesis calibrated to user's historical vocal tone",
      "Smart home Matter/HomeKit bridge for neural appliance switching",
    ],
    createdAt: "2026-08-15T10:30:00.000Z",
    evaluation: {
      innovationScore: 96,
      feasibilityScore: 78,
      usefulnessScore: 98,
      scalabilityScore: 82,
      complexityScore: 88,
      readinessScore: 88,
      estimatedCost: "$350 - $600 (Hardware prototype + cloud compute)",
      possibleChallenges: [
        "Electromyographic (jaw clench) muscle noise interfering with EEG signals",
        "Subject-to-subject electrode impedance variability requiring continuous recalibration",
      ],
      securityConcerns: [
        "Biometric privacy: Raw brainwave patterns can reveal cognitive state and medical conditions",
        "Fail-safe emergency stop mechanism for physical robotic navigation",
      ],
      missingFeatures: [
        "Auditory biofeedback loop to assist users during mental focus training",
        "Cloud-synced neurologist dashboard for longitudinal recovery tracking",
      ],
      keyStrengths: [
        "Extraordinary real-world humanitarian impact",
        "High barrier to entry with deep technical defensibility",
      ],
      recommendationSummary:
        "Outstanding cutting-edge proposal. Validate offline classification accuracy with pre-recorded datasets before field testing with physical actuators.",
    },
  },
  {
    id: "seed-proj-2",
    title: "AgriVision: Drone-Powered Multispectral Crop Health & Pest Predictor",
    domain: "Agriculture & IoT",
    problemStatement:
      "Smallholder and commercial farms lose over 30% of crop yields annually due to delayed detection of fungal blight, soil nutrient depletion, and irrigation leaks.",
    description:
      "An automated edge-AI scouting system where drone multispectral camera feeds are stitched into NDVI orthomosaics, predicting crop stress 7-10 days before visible foliage damage occurs.",
    objectives: [
      "Process 4K multispectral drone imagery at 15 frames/sec on edge hardware",
      "Detect early-stage fungal infection hotspots with spatial precision within 0.5 meters",
      "Generate automated variable-rate fertilizer recommendation maps for tractors",
    ],
    targetUsers: ["Agronomists", "Farm Operators", "Agricultural Insurance Assessors"],
    technologiesRequired: ["Python", "YOLOv8", "OpenCV", "FastAPI", "Mapbox GL", "React"],
    hardwareRequirements: ["DJI / Custom Drone with RedEdge Multispectral Sensor", "NVIDIA Jetson Orin Nano"],
    softwareRequirements: ["QGIS", "GDAL Geospatial Library", "PostGIS / SQLite"],
    databaseRequirements: ["Spatially-indexed relational database with GeoJSON polygon support"],
    aiMlAlgorithms: ["Convolutional Autoencoders for Anomaly Detection", "NDVI Vegetation Index Analysis"],
    developmentModules: [
      { name: "Orthomosaic Stitched Pipeline", description: "Assembles individual aerial captures into georeferenced maps" },
      { name: "Pathogen Classifier", description: "Identifies early-stage foliar lesions using custom vision weights" },
      { name: "Prescription Map Generator", description: "Exports ISO-XML files directly compatible with smart tractors" },
    ],
    systemArchitectureExplanation:
      "Drone captures NDVI and thermal bands; the onboard Jetson runs edge inference or streams to a cloud FastAPI server. GeoTIFF layers are published via TileServer to a React Mapbox visualizer with farm health heatmaps.",
    apiSuggestions: ["POST /api/drone/upload", "GET /api/farm/:id/ndvi", "POST /api/prescriptions/generate"],
    estimatedDevelopmentTime: "2 Months",
    difficultyScore: 7,
    innovationScore: 9,
    scalabilitySuggestions: [
      "Tile large agricultural maps into cloud-optimized GeoTIFFs (COG) on S3",
      "Leverage satellite synthetic aperture radar (SAR) feeds during overcast weather",
    ],
    futureEnhancements: [
      "Autonomous docking station with automated drone battery hot-swapping",
      "Direct integration with smart drip irrigation solenoid valves",
    ],
    createdAt: "2026-08-18T14:15:00.000Z",
  },
  {
    id: "seed-proj-3",
    title: "VeriChain: Zero-Knowledge Supply Chain Traceability & ESG Verifier",
    domain: "Blockchain",
    problemStatement:
      "Global supply chains are plagued by greenwashing, counterfeits, and opaque carbon emission claims that cannot be independently audited.",
    description:
      "A privacy-preserving supply chain verification network where manufacturers record provenance, raw material origins, and carbon footprints using zk-SNARKs on Ethereum Layer 2.",
    objectives: [
      "Cryptographically prove raw materials comply with fair-trade standards without revealing proprietary supplier pricing",
      "Provide consumer-facing instant QR code passport verification",
      "Enable automated carbon credit settlement via smart contracts",
    ],
    targetUsers: ["Ethical Brand Consumers", "Supply Chain Auditors", "Logistics Directors"],
    technologiesRequired: ["Solidity", "Circom (zk-SNARKs)", "Ethers.js", "Node.js", "React", "Tailwind CSS"],
    hardwareRequirements: ["NFC / RFID Temperature-Logging Smart Tags"],
    softwareRequirements: ["Hardhat / Foundry", "SnarkJS", "SQLite / Subgraph"],
    databaseRequirements: ["Hybrid on-chain merkle root anchoring + off-chain SQLite indexer"],
    aiMlAlgorithms: ["Zero-Knowledge Proof Arithmetic Circuits", "Anomaly detection on sensor logs"],
    developmentModules: [
      { name: "ZK-Circuit Verifier", description: "Generates cryptographic proofs for batch origin verification" },
      { name: "Logistics Event Tracker", description: "Ingests RFID scans and cold-chain temperature telemetry" },
      { name: "Public Passport Portal", description: "Mobile-optimized consumer scanner displaying verified provenance" },
    ],
    systemArchitectureExplanation:
      "Suppliers generate zero-knowledge proofs locally using Circom. Smart contracts on Polygon verify the proof against on-chain state. The client application renders an interactive tamper-proof timeline of the item's journey.",
    apiSuggestions: ["POST /api/proof/generate", "POST /api/proof/verify", "GET /api/passport/:serial"],
    estimatedDevelopmentTime: "3 Months",
    difficultyScore: 8,
    innovationScore: 9,
    scalabilitySuggestions: [
      "Batch 10,000 shipment events into a single cryptographic Merkle root to minimize gas fees",
      "Use decentralized IPFS storage with Filecoin persistence pinning",
    ],
    futureEnhancements: [
      "Autonomous carbon tax accounting automated via DeFi liquidity pools",
      "Tamper-evident holographic NFC seal integration",
    ],
    createdAt: "2026-08-20T09:00:00.000Z",
  },
];

class DatabaseManager {
  private projects: ProjectIdea[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        this.projects = JSON.parse(raw);
      } else {
        this.projects = [...SEED_PROJECTS];
        this.save();
      }
    } catch (e) {
      console.error("Error reading database file, using seeds:", e);
      this.projects = [...SEED_PROJECTS];
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.projects, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing database file:", e);
    }
  }

  public getAll(): ProjectIdea[] {
    return [...this.projects].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getById(id: string): ProjectIdea | undefined {
    return this.projects.find((p) => p.id === id);
  }

  public create(project: ProjectIdea): ProjectIdea {
    const existingIndex = this.projects.findIndex((p) => p.id === project.id);
    if (existingIndex >= 0) {
      this.projects[existingIndex] = { ...this.projects[existingIndex], ...project };
    } else {
      this.projects.unshift(project);
    }
    this.save();
    return project;
  }

  public createMany(projects: ProjectIdea[]): ProjectIdea[] {
    for (const proj of projects) {
      const idx = this.projects.findIndex((p) => p.id === proj.id);
      if (idx >= 0) {
        this.projects[idx] = { ...this.projects[idx], ...proj };
      } else {
        this.projects.unshift(proj);
      }
    }
    this.save();
    return projects;
  }

  public update(id: string, updates: Partial<ProjectIdea>): ProjectIdea | null {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.projects[idx] = { ...this.projects[idx], ...updates };
    this.save();
    return this.projects[idx];
  }

  public delete(id: string): boolean {
    const prevLen = this.projects.length;
    this.projects = this.projects.filter((p) => p.id !== id);
    if (this.projects.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  public getStats(): DashboardStats {
    const all = this.getAll();
    const evaluated = all.filter((p) => p.evaluation !== undefined);

    let totalInnovation = 0;
    let totalReadiness = 0;
    const domainCounts: { [domain: string]: number } = {};
    const techCounts: { [tech: string]: number } = {};
    const difficultyCounts: { [diff: string]: number } = {
      Beginner: 0,
      Intermediate: 0,
      Advanced: 0,
      Expert: 0,
    };

    for (const p of all) {
      totalInnovation += p.innovationScore || 8;
      if (p.evaluation) {
        totalReadiness += p.evaluation.readinessScore || 80;
      }

      // Domain
      const d = p.domain || "Artificial Intelligence";
      domainCounts[d] = (domainCounts[d] || 0) + 1;

      // Tech
      for (const t of p.technologiesRequired || []) {
        techCounts[t] = (techCounts[t] || 0) + 1;
      }

      // Difficulty
      const diffScore = p.difficultyScore || 5;
      if (diffScore <= 4) difficultyCounts["Beginner"]++;
      else if (diffScore <= 6) difficultyCounts["Intermediate"]++;
      else if (diffScore <= 8) difficultyCounts["Advanced"]++;
      else difficultyCounts["Expert"]++;
    }

    const avgInnovation = all.length > 0 ? +(totalInnovation / all.length).toFixed(1) : 8.5;
    const avgReadiness = evaluated.length > 0 ? Math.round(totalReadiness / evaluated.length) : 84;

    // Find most popular tech
    let mostSelectedTech = "Python";
    let maxTechCount = 0;
    for (const [t, c] of Object.entries(techCounts)) {
      if (c > maxTechCount) {
        maxTechCount = c;
        mostSelectedTech = t;
      }
    }

    // Find most popular domain
    let mostPopularDomain = "Artificial Intelligence";
    let maxDomCount = 0;
    for (const [dom, count] of Object.entries(domainCounts)) {
      if (count > maxDomCount) {
        maxDomCount = count;
        mostPopularDomain = dom;
      }
    }

    return {
      totalProjectsGenerated: all.length,
      totalProjectsEvaluated: evaluated.length,
      averageInnovationScore: avgInnovation,
      averageReadinessScore: avgReadiness,
      mostSelectedTechnology: mostSelectedTech,
      mostPopularDomain,
      domainDistribution: domainCounts,
      techDistribution: techCounts,
      difficultyDistribution: difficultyCounts,
      recentProjects: all.slice(0, 5),
    };
  }
}

export const db = new DatabaseManager();
