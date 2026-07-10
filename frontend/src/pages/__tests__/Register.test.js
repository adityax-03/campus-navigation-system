import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Register from "../Register";
import { useAuth } from "../../context/AuthContext";

// Mock Navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

// Mock Auth Context
const mockRegister = jest.fn();
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    register: mockRegister,
    user: null,
    loading: false,
    error: null
  })
}));

describe("Register Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Sign Up form and checklist", () => {
    render(<Register />);
    
    expect(screen.getByRole("heading", { name: "Sign Up", level: 2 })).toBeInTheDocument();
    
    // Check Inputs
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Registration No. (e.g. 2023CS45)")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    
    // Check Checklist and terms
    expect(screen.getByText("Easy Navigation")).toBeInTheDocument();
    expect(screen.getByText("Save Time")).toBeInTheDocument();
    expect(screen.getByText("Explore More")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up →" })).toBeInTheDocument();
  });

  test("shows mismatch error if passwords do not match", async () => {
    render(<Register />);
    
    // Fill credentials
    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "Aditya Gupta" } });
    fireEvent.change(screen.getByPlaceholderText("Registration No. (e.g. 2023CS45)"), { target: { value: "2023CS45" } });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "aditya@college.edu" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "password456" } }); // mismatch
    
    // Agree terms
    const checkbox = screen.getByLabelText(/I agree to the/i);
    fireEvent.click(checkbox);
    
    // Submit
    fireEvent.click(screen.getByRole("button", { name: "Sign Up →" }));
    
    await waitFor(() => {
      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  test("shows error if terms and conditions are not checked", async () => {
    render(<Register />);
    
    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "Aditya Gupta" } });
    fireEvent.change(screen.getByPlaceholderText("Registration No. (e.g. 2023CS45)"), { target: { value: "2023CS45" } });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "aditya@college.edu" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "password123" } });
    
    // Note: terms checkbox is not checked!
    
    fireEvent.click(screen.getByRole("button", { name: "Sign Up →" }));
    
    await waitFor(() => {
      expect(screen.getByText("You must agree to the Terms of Service & Privacy Policy.")).toBeInTheDocument();
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  test("calls register service and redirects on successful input", async () => {
    mockRegister.mockResolvedValueOnce({ success: true });
    
    render(<Register />);
    
    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "Aditya Gupta" } });
    fireEvent.change(screen.getByPlaceholderText("Registration No. (e.g. 2023CS45)"), { target: { value: "2023CS45" } });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "aditya@college.edu" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "password123" } });
    
    const checkbox = screen.getByLabelText(/I agree to the/i);
    fireEvent.click(checkbox);
    
    fireEvent.click(screen.getByRole("button", { name: "Sign Up →" }));
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith("Aditya Gupta", "2023CS45", "aditya@college.edu", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});
