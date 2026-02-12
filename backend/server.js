// server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Temporary in-memory jobs array
let jobs = [];

// Get all jobs
app.get("/api/jobs", (req, res) => {
  res.json(jobs);
});

// Add a new job
app.post("/api/jobs", (req, res) => {
  const job = { 
    ...req.body, 
    _id: Date.now().toString(), 
    postedDate: new Date() 
  };
  jobs.push(job);
  res.status(201).json(job);
});

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
