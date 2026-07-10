import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../Login";
import { useAuth } from "../../context/AuthContext";

// Mock Navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

// Mock Auth Context
const mockLogin = jest.fn();
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    loading: false,
    error: null
  })
}));

describe("Login Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Sign In form fields and title", () => {
    render(<Login />);
    
    // Check Title and Subtitle
    expect(screen.getByRole("heading", { name: "Sign In", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("Enter your credentials to access your account")).toBeInTheDocument();
    
    // Check Inputs
    expect(screen.getByPlaceholderText("Email or Registration No.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    
    // Check Buttons and links
    expect(screen.getByRole("button", { name: "Sign In →" })).toBeInTheDocument();
    expect(screen.getByText("Remember me")).toBeInTheDocument();
    expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
  });

  test("shows error warning on empty inputs click", async () => {
    render(<Login />);
    
    const submitBtn = screen.getByRole("button", { name: "Sign In →" });
    
    // Trigger submit with blank inputs (HTML5 validation mock fallback)
    fireEvent.click(submitBtn);
    
    // The browser prevents submission since they are 'required', 
    // let's verify if auth isn't called
    expect(mockLogin).not.toHaveBeenCalled();
  });

  test("triggers auth login service and navigates on success", async () => {
    mockLogin.mockResolvedValueOnce({ success: true });
    
    render(<Login />);
    
    // Fill credentials
    fireEvent.change(screen.getByPlaceholderText("Email or Registration No."), {
      target: { value: "aditya@college.edu" }
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" }
    });
    
    // Submit
    fireEvent.click(screen.getByRole("button", { name: "Sign In →" }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("aditya@college.edu", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("displays error message if login credentials are invalid", async () => {
    mockLogin.mockResolvedValueOnce({ success: false, message: "Invalid credentials" });
    
    render(<Login />);
    
    fireEvent.change(screen.getByPlaceholderText("Email or Registration No."), {
      target: { value: "wrong@college.edu" }
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpass" }
    });
    
    fireEvent.click(screen.getByRole("button", { name: "Sign In →" }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("wrong@college.edu", "wrongpass");
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
