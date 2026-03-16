const express  = require("express");
const fetch    = require("node-fetch");
const cors     = require("cors");

const app      = express();
const PORT     = 3001;
const ODDS_KEY = "747faf2c476eb3d8b30498b2e31f0c68";
const ODDS_BASE = "https://api.the-odds-api.com/v4";

app.use(cors());
app.use(express.json());

app.use("/api", async (req, res) => {
  const query = new URLSearchParams({ ...req.query, apiKey: ODDS_KEY }).toString();
  const url   = `${ODDS_BASE}${req.path}?${query}`;

  console.log(`[Proxy] GET ${url}`);

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
    console.error("[Proxy] Erreur :", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy Radar Paris (The Odds API) lancé sur http://localhost:${PORT}`);
});
