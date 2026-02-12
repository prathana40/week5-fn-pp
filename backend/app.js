// app.js
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// In-memory array to store jobs
let jobs = [];

// GET all jobs
app.get("/api/jobs", (req, res) => {
  res.json(jobs);
});

// POST a new job
app.post("/api/jobs", (req, res) => {
  try {
    const { title, type, location, description, salary, company } = req.body;

    if (!title || !type || !location || !description || !salary || !company) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const job = {
      _id: Date.now().toString(),
      title,
      type,
      location,
      description,
      salary,
      company, // nested object { name, contactEmail, contactPhone }
      postedDate: new Date(),
    };

    jobs.push(job);

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: "Failed to add job" });
  }
});

// Handle unknown endpoints
app.use((req, res) => {
  res.status(404).json({ error: "Unknown endpoint" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
