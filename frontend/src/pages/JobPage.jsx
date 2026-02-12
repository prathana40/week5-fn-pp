 import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const JobPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // Use relative URL for test compatibility
        const res = await fetch(`/jobs/${id}`);
        if (!res.ok) throw new Error("Failed to fetch job");
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const deleteJob = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`/jobs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete job");
      alert("Job deleted successfully!");
      navigate("/"); // Go back to home after deletion
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div>Loading job details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!job) return <div>No job found</div>;

  return (
    <div className="job-details">
      <h2>{job.title}</h2>
      <p>Type: {job.type}</p>
      <p>Description: {job.description}</p>
      <p>Company: {job.company?.name}</p>
      <p>Contact Email: {job.company?.contactEmail}</p>
      <p>Contact Phone: {job.company?.contactPhone}</p>
      <p>Location: {job.location}</p>
      <p>Salary: {job.salary}</p>
      <p>Posted Date: {job.postedDate}</p>

      <Link to={`/edit-job/${id}`}>
        <button>Edit Job</button>
      </Link>
      <button onClick={deleteJob}>Delete Job</button>
    </div>
  );
};

export default JobPage;
