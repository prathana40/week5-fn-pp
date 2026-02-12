 import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddJobPage from "../pages/AddJobPage";
import { MemoryRouter } from "react-router-dom";

// ---- mock router ----
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// ---- reusable helpers ----
const renderPage = () =>
  render(<AddJobPage />, { wrapper: MemoryRouter });

const fillForm = () => {
  fireEvent.change(screen.getByLabelText(/Job title/i), { target: { value: "Dev" } });
  fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: "Helsinki" } });
  fireEvent.change(screen.getByLabelText(/Job Description/i), { target: { value: "Great job" } });
  fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: "Tech Corp" } });
  fireEvent.change(screen.getByLabelText(/Contact Email/i), { target: { value: "hr@test.com" } });
  fireEvent.change(screen.getByLabelText(/Contact Phone/i), { target: { value: "123456" } });
  fireEvent.change(screen.getByLabelText(/Salary/i), { target: { value: 5000 } });
};

describe("AddJobPage", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );

    global.alert = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ---------- render test ----------
  it("renders all form fields", () => {
    renderPage();

    expect(screen.getByLabelText(/Job title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Job type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Job Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Salary/i)).toBeInTheDocument();
  });

  // ---------- success test ----------
  it("submits form and navigates home on success", async () => {
    renderPage();
    fillForm();

    fireEvent.click(screen.getByText(/Add Job/i));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(fetch).toHaveBeenCalledWith(
      "/api/jobs",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.any(String),
      })
    );

    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  // ---------- error test ----------
  it("shows alert when API fails", async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false }));

    renderPage();
    fillForm();

    fireEvent.click(screen.getByText(/Add Job/i));

    await waitFor(() =>
      expect(global.alert).toHaveBeenCalledWith(
        "Failed to add job. Please try again."
      )
    );
  });
});
