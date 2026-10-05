import dotenv from "dotenv";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config({ path: ".env.local" });
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const hasDist = fs.existsSync(path.join(distDir, "index.html"));

const apiKey = process.env.API_KEY;
const apiBase = (process.env.API_BASE_URL || "")
  .replace(/\/products\/?$/, "")
  .replace(/\/$/, "");

const app = express();
const port = Number(process.env.PORT) || 3000;

async function proxyProducts(req, res) {
  if (!apiKey || !apiBase) {
    res.status(500).json({ message: "Missing API_KEY or API_BASE_URL." });
    return;
  }

  const upstream = new URL(`${apiBase}/products`);
  for (const key of ["search", "limit", "offset"]) {
    const value = req.query[key];
    if (typeof value === "string" && value) {
      upstream.searchParams.set(key, value);
    }
  }

  try {
    const response = await fetch(upstream, {
      headers: { "x-api-key": apiKey },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch {
    res.status(502).json({ message: "Could not connect to the catalog." });
  }
}

async function proxyProductById(req, res) {
  if (!apiKey || !apiBase) {
    res.status(500).json({ message: "Missing API_KEY or API_BASE_URL." });
    return;
  }

  try {
    const response = await fetch(
      `${apiBase}/products/${encodeURIComponent(req.params.id)}`,
      { headers: { "x-api-key": apiKey } },
    );
    const data = await response.json();
    res.status(response.status).json(data);
  } catch {
    res.status(502).json({ message: "Could not load the product." });
  }
}

app.get("/api/products", proxyProducts);
app.get("/api/products/:id", proxyProductById);

if (hasDist) {
  app.use(express.static(distDir));
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`BFF listening on http://localhost:${port}`);
  if (!hasDist) {
    console.log("No dist/ found — API only (use Vite for the SPA in dev).");
  }
});
