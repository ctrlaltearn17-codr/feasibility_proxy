const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY; // set in Render/Railway

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "feasibility-proxy", time: new Date() });
});

// Trends route
app.get("/trends", async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const location = req.query.location || "South Africa";
    if (!keyword) return res.status(400).json({ error: "Missing keyword" });

    const url = `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(keyword)}&geo=${encodeURIComponent(location)}&api_key=${API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Shopping route (price ranges)
app.get("/shopping", async (req, res) => {
  try {
    const keyword = req.query.keyword;
    if (!keyword) return res.status(400).json({ error: "Missing keyword" });

    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(keyword)}&api_key=${API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Feasibility Proxy running on port ${PORT}`);
});
