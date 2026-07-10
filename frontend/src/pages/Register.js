import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !registrationNo || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setErrorMsg("You must agree to the Terms of Service & Privacy Policy.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const result = await register(name, registrationNo, email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setErrorMsg(result.message || "Failed to create account. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Left Column - Hero pane */}
      <div 
        className="auth-hero-pane" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop')" }}
      >
        <div className="auth-hero-header">
          <div className="logo-badge">R</div>
          <h2>CCNS</h2>
        </div>

        <div className="auth-hero-content">
          <h3>Create Account<br />Start Your Journey</h3>
          <p>Join thousands of students who navigate campus smartly. Register now to save favorites, look up classroom paths, and track your route history.</p>
          
          <div className="auth-checklist">
            <div className="auth-check-item">
              <div className="auth-check-icon">✓</div>
              <div className="auth-check-text">
                <h4>Easy Navigation</h4>
                <p>Find any place on campus in a few clicks</p>
              </div>
            </div>
            
            <div className="auth-check-item">
              <div className="auth-check-icon">✓</div>
              <div className="auth-check-text">
                <h4>Save Time</h4>
                <p>Get the shortest paths and estimated travel times instantly</p>
              </div>
            </div>
            
            <div className="auth-check-item">
              <div className="auth-check-icon">✓</div>
              <div className="auth-check-text">
                <h4>Explore More</h4>
                <p>Discover libraries, cafeterias, and nearby spots like never before</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-hero-footer" />
      </div>

      {/* Right Column - Form pane */}
      <div className="auth-form-pane">
        <div className="form-header">
          <h2>Sign Up</h2>
          <p>Create your account to get started</p>
        </div>

        {errorMsg && (
          <div className="error-alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            {errorMsg}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-container">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <input 
                type="text" 
                className="auth-input" 
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Registration No */}
          <div className="form-group">
            <label className="form-label">Registration No.</label>
            <div className="input-container">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
              </span>
              <input 
                type="text" 
                className="auth-input" 
                placeholder="Registration No. (e.g. 2023CS45)"
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-container">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </span>
              <input 
                type="email" 
                className="auth-input" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-container">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input 
                type="password" 
                className="auth-input" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-container">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input 
                type="password" 
                className="auth-input" 
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Terms Option */}
          <div className="form-options">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={agreeTerms} 
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              I agree to the <a href="#terms" className="forgot-password-link" onClick={e => e.preventDefault()}>Terms of Service</a> and <a href="#privacy" className="forgot-password-link" onClick={e => e.preventDefault()}>Privacy Policy</a>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up →"}
          </button>
        </form>

        <div className="auth-footer-text">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
