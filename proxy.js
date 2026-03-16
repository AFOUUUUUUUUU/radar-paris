const express  = require("express");
const fetch    = require("node-fetch");
const cors     = require("cors");

const app      = express();
const PORT     = 3001;
const ODDS_KEY  = "747faf2c476eb3d8b30498b2e31f0c68";
const ODDS_BASE = "https://api.the-odds-api.com/v4";
const AF_KEY    = "e7f5ce667a21f5bf35db176194616dda";
const AF_BASE   = "https://v3.football.api-sports.io";

app.use(cors());
app.use(express.json());

// Route The Odds API
app.use("/api", async (req, res) => {
  const query = new URLSearchParams({ ...req.query, apiKey: ODDS_KEY }).toString();
  const url   = `${ODDS_BASE}${req.path}?${query}`;
  console.log(`[OddsAPI] GET ${url}`);
  try {
    const response = await fetch(url);
    const remaining = response.headers.get("x-requests-remaining");
    const used      = response.headers.get("x-requests-used");
    if (remaining) res.set("x-requests-remaining", remaining);
    if (used)      res.set("x-requests-used", used);
    res.set("Access-Control-Expose-Headers", "x-requests-remaining, x-requests-used");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("[OddsAPI] Erreur :", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Route API-Football
app.use("/af", async (req, res) => {
  const query = new URLSearchParams(req.query).toString();
  const url   = `${AF_BASE}${req.path}?${query}`;
  console.log(`[API-Football] GET ${url}`);
  try {
    const response = await fetch(url, {
      headers: { "x-apisports-key": AF_KEY }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("[API-Football] Erreur :", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy Radar Paris lancé sur http://localhost:${PORT}`);
});
