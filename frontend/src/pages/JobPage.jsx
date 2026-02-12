 import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const JobPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const navigate = useNavigate();

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        // ✅ Correct endpoint for tests
        const res = await fetch(`/api/jobs/${id}`);
        if (!res.ok) throw new Error("Failed to fetch job");
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error(err); // ✅ Required for network error test
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // Delete job (test-friendly)
  const deleteJob = async () => {
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" }); // ✅ Correct endpoint
      if (!res.ok) throw new Error("Failed to delete job");
      navigate("/"); // go back to home after deletion
    } catch (err) {
      console.error(err); // ✅ Required for network error test
      setDeleteError(err.message);
    }
  };

  // Loading / error / empty states
  if (loading) return <div>Loading job details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!job) return <div>No job found</div>;

  return (
    <div className="job-details">
      {/* Display delete error inline */}
      {deleteError && <div className="delete-error">Delete Error: {deleteError}</div>}

      <h2>{job.title}</h2>
      <p>Type: {job.type}</p>
      <p>Description: {job.description}</p>
      <p>Company: {job.company?.name || "N/A"}</p>
      <p>Contact Email: {job.company?.contactEmail || "N/A"}</p>
      <p>Contact Phone: {job.company?.contactPhone || "N/A"}</p>
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
