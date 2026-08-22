import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { apiRouter } from "./server/routes.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Routes
app.use("/api", apiRouter);

// Serve static frontend in production
const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ success: false, message: "API route not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`AI Innovation Lab server running on http://0.0.0.0:${PORT}`);
});
