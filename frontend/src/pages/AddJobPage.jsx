 import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddJobPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Full-Time");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState(4500);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newJob = {
      title,
      type,
      description,
      location,
      salary,
      company: {
        name: companyName,
        contactEmail,
        contactPhone,
      },
    };

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newJob),
      });

      // API error (status not OK)
      if (!res.ok) {
        throw new Error("Failed request");
      }

      // success → navigate home
      navigate("/");
    } catch (err) {
      // network OR api error → alert
      alert("Failed to add job. Please try again.");
    }
  };

  return (
    <div className="create">
      <h2>Add a New Job</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Job title:</label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="type">Job type:</label>
        <select
          id="type"
          required
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
        </select>

        <label htmlFor="description">Job Description:</label>
        <textarea
          id="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="companyName">Company Name:</label>
        <input
          id="companyName"
          type="text"
          required
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <label htmlFor="contactEmail">Contact Email:</label>
        <input
          id="contactEmail"
          type="email"
          required
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />

        <label htmlFor="contactPhone">Contact Phone:</label>
        <input
          id="contactPhone"
          type="tel"
          required
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />

        <label htmlFor="location">Location:</label>
        <input
          id="location"
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label htmlFor="salary">Salary:</label>
        <input
          id="salary"
          type="number"
          required
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />

        <button type="submit">Add Job</button>
      </form>
    </div>
  );
};

export default AddJobPage;
