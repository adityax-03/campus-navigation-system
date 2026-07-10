import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

const Login = () => {
  const [emailOrRegNo, setEmailOrRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrRegNo || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const result = await login(emailOrRegNo, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setErrorMsg(result.message || "Invalid credentials. Please try again.");
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
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop')" }}
      >
        <div className="auth-hero-header">
          <div className="logo-badge">R</div>
          <h2>CCNS</h2>
        </div>

        <div className="auth-hero-content">
          <h3>Welcome Back!<br />Good to See You Again</h3>
          <p>Sign in to continue your journey and explore campus seamlessly. Get the fastest walking routes and locate campus blocks with ease.</p>
        </div>

        <div className="auth-hero-footer">
          <div className="quote-bubble">
            "The best way to find yourself is to lose yourself in the service of others."
            <span className="quote-author">— Mahatma Gandhi</span>
          </div>
        </div>
      </div>

      {/* Right Column - Form pane */}
      <div className="auth-form-pane">
        <div className="form-header">
          <h2>Sign In</h2>
          <p>Enter your credentials to access your account</p>
        </div>

        {errorMsg && (
          <div className="error-alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            {errorMsg}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email / Reg No */}
          <div className="form-group">
            <label className="form-label">Email or Registration No.</label>
            <div className="input-container">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <input 
                type="text" 
                className="auth-input" 
                placeholder="Email or Registration No."
                value={emailOrRegNo}
                onChange={(e) => setEmailOrRegNo(e.target.value)}
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
                type={showPassword ? "text" : "password"} 
                className="auth-input" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          {/* Form Options */}
          <div className="form-options">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#forgot" className="forgot-password-link" onClick={(e) => e.preventDefault()}>
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In →"}
          </button>
        </form>

        <div className="auth-divider">or continue with</div>

        {/* Social Logins */}
        <div className="social-login-container">
          <button className="btn-social" onClick={() => navigate("/dashboard")}>
            {/* Google Icon */}
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
            Google
          </button>
          <button className="btn-social" onClick={() => navigate("/dashboard")}>
            {/* Microsoft Icon */}
            <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="10" height="10" fill="#f25022"/><rect x="12" y="1" width="10" height="10" fill="#7fba00"/><rect x="1" y="12" width="10" height="10" fill="#00a4ef"/><rect x="12" y="12" width="10" height="10" fill="#ffb900"/></svg>
            Microsoft
          </button>
        </div>

        <div className="auth-footer-text">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
