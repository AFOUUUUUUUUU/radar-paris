const express  = require("express");
const fetch    = require("node-fetch");
const cors     = require("cors");

const app      = express();
const PORT     = 3001;
const ODDS_KEY  = "0d963cf290b4b33c9008a75e68ddde7d";
const ODDS_BASE = "https://api.the-odds-api.com/v4";
const FD_KEY    = "8a1de6eb00154a76b7718739c8eaafac";
const FD_BASE   = "https://api.football-data.org/v4";

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

// Route Football-Data.org
app.use("/fd", async (req, res) => {
  const query = new URLSearchParams(req.query).toString();
  const url   = `${FD_BASE}${req.path}${query ? '?' + query : ''}`;
  console.log(`[FootballData] GET ${url}`);
  try {
    const response = await fetch(url, {
      headers: { "X-Auth-Token": FD_KEY }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("[FootballData] Erreur :", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy Radar Paris lancé sur http://localhost:${PORT}`);
});
