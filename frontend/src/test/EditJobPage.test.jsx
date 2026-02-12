 // src/test/EditJobPage.test.jsx
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import EditJobPage from "../pages/EditJobPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("EditJobPage", () => {
  const jobId = "123";
  const jobData = {
    title: "Software Engineer",
    type: "Full-Time",
    location: "Helsinki",
    description: "Great job",
    salary: 5000,
    company: {
      name: "Tech Corp",
      contactEmail: "hr@tech.com",
      contactPhone: "123-456-7890",
    },
  };

  beforeEach(() => {
    // Reset mocks
    mockNavigate.mockReset();

    global.fetch = vi.fn((url, options) => {
      if (options?.method === "PUT") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...jobData, title: options.body.title }),
        });
      }
      // GET job
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(jobData),
      });
    });
  });

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={[`/edit/${jobId}`]}>
        <Routes>
          <Route path="/edit/:id" element={<EditJobPage />} />
        </Routes>
      </MemoryRouter>
    );

  it("fetches job data and populates form fields", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByLabelText(/Job title/i)).toHaveValue(jobData.title);
      expect(screen.getByLabelText(/Job type/i)).toHaveValue(jobData.type);
      expect(screen.getByLabelText(/Job Description/i)).toHaveValue(jobData.description);
      expect(screen.getByLabelText(/Company Name/i)).toHaveValue(jobData.company.name);
      expect(screen.getByLabelText(/Contact Email/i)).toHaveValue(jobData.company.contactEmail);
      expect(screen.getByLabelText(/Contact Phone/i)).toHaveValue(jobData.company.contactPhone);
      expect(screen.getByLabelText(/Location/i)).toHaveValue(jobData.location);
      expect(screen.getByLabelText(/Salary/i)).toHaveValue(jobData.salary);
    });
  });

  it("submits updated job data via PUT request and navigates to job page", async () => {
    renderComponent();

    await waitFor(() => screen.getByLabelText(/Job title/i));

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Job title/i), { target: { value: "Updated Title" } });
      fireEvent.change(screen.getByLabelText(/Salary/i), { target: { value: "6000" } });
      fireEvent.click(screen.getByText(/Update Job/i));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`/api/jobs/${jobId}`, expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Updated Title",
          type: jobData.type,
          location: jobData.location,
          description: jobData.description,
          salary: "6000",
          company: jobData.company,
        }),
      }));

      expect(mockNavigate).toHaveBeenCalledWith(`/jobs/${jobId}`);
    });
  });

  it("navigates to job page on cancel button click", async () => {
    renderComponent();

    await waitFor(() => screen.getByText(/Cancel/i));

    await act(async () => {
      fireEvent.click(screen.getByText(/Cancel/i));
    });

    expect(mockNavigate).toHaveBeenCalledWith(`/jobs/${jobId}`);
  });
});
