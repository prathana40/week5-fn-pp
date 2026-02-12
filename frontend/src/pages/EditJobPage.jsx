 import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Full-Time");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState(4500);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (!res.ok) throw new Error("Failed to fetch job");
        const data = await res.json();
        setTitle(data.title);
        setType(data.type);
        setDescription(data.description);
        setCompanyName(data.company.name);
        setContactEmail(data.company.contactEmail);
        setContactPhone(data.company.contactPhone);
        setLocation(data.location);
        setSalary(data.salary);
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };
    fetchJob();
  }, [id]);

  const submitForm = async (e) => {
    e.preventDefault();
    const updatedJob = {
      title,
      type,
      location,
      description,
      salary,
      company: {
        name: companyName,
        contactEmail,
        contactPhone,
      },
    };

    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedJob),
      });

      if (!res.ok) throw new Error("Failed to update job");
      await res.json();
      navigate(`/jobs/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelEdit = () => {
    navigate(`/jobs/${id}`);
  };

  return (
    <div className="create">
      <h2>Edit Job</h2>
      <form onSubmit={submitForm}>
        <label htmlFor="title">Job title:</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label htmlFor="type">Job type:</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Remote">Remote</option>
          <option value="Internship">Internship</option>
        </select>

        <label htmlFor="description">Job Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label htmlFor="companyName">Company Name:</label>
        <input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />

        <label htmlFor="contactEmail">Contact Email:</label>
        <input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />

        <label htmlFor="contactPhone">Contact Phone:</label>
        <input id="contactPhone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />

        <label htmlFor="location">Location:</label>
        <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />

        <label htmlFor="salary">Salary:</label>
        <input id="salary" type="number" value={salary} onChange={(e) => setSalary(e.target.value)} required />

        <button type="submit">Update Job</button>
        <button type="button" onClick={cancelEdit}>Cancel</button>
      </form>
    </div>
  );
};

export default EditJobPage;
