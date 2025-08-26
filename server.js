const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const API_KEY = process.env.SERPAPI_KEY; // set in Render dashboard

// Root health check
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "feasibility-proxy", time: new Date() });
});

// Universal search endpoint
app.get("/search", async (req, res) => {
  try {
    const engine = req.query.engine || "google";
    const q = req.query.q || "startup";
    const location = req.query.location || "South Africa"; // ✅ define it here

    const url = `https://serpapi.com/search.json?engine=${engine}&q=${encodeURIComponent(q)}&location=${encodeURIComponent(location)}&api_key=${API_KEY}`;

    console.log("Fetching URL:", url); // ✅ debug log

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching from SerpApi" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Proxy running on port ${PORT}`));

 
