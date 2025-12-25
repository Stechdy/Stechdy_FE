import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import AuthInput from '../../components/common/AuthInput';
import AuthButton from '../../components/common/AuthButton';
import { forgotPassword } from '../../services/authService';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  const validateEmail = () => {
    if (!email) {
      setError('Please enter email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await forgotPassword(email);
      
      if (response.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'Unable to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="success-message">
          <div className="success-icon">✉️</div>
          <h2>Check Your Email</h2>
          <p>
            We've sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions.
          </p>
          <p className="note">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <AuthButton onClick={() => navigate('/login')}>
            Back to login
          </AuthButton>
          <div className="resend-link">
            <button onClick={() => setSuccess(false)} className="link-button">
              Try another email
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="forgot-password-header">
        <h1 className="auth-title">Forgot Password?</h1>
        <h2 className="auth-brand">S'techdy</h2>
        <p className="auth-subtitle">
          Enter your email address and we'll send you a password reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="forgot-password-form">
        {error && (
          <div className="forgot-alert forgot-alert-error">
            {error}
          </div>
        )}

        <div className="forgot-form-group">
          <label className="forgot-form-label">Email</label>
          <AuthInput
            type="email"
            name="email"
            placeholder="email@example.com"
            value={email}
            onChange={handleChange}
            icon="📧"
            error={error}
          />
        </div>

        <AuthButton 
          type="submit" 
          loading={loading}
          disabled={loading}
        >
          Send reset link
        </AuthButton>

        <div className="back-to-login">
          <Link to="/login">← Back to login</Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
