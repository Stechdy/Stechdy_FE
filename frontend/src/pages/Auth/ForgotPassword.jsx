import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthLayout from "../../components/layout/AuthLayout";
import AuthInput from "../../components/common/AuthInput";
import AuthButton from "../../components/common/AuthButton";
import { forgotPassword } from "../../services/authService";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError("");
    }
  };

  const validateEmail = () => {
    if (!email) {
<<<<<<< Updated upstream
      setError('Please enter email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email');
=======
      setError(t("auth.validation.emailRequired"));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t("auth.validation.emailInvalid"));
>>>>>>> Stashed changes
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
    setError("");

    try {
      const response = await forgotPassword(email);

      if (response.success) {
        setSuccess(true);
      }
    } catch (err) {
<<<<<<< Updated upstream
      setError(err.message || 'Unable to send email. Please try again.');
=======
      setError(err.message || t("auth.forgotPassword.submit"));
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="success-message">
          <div className="success-icon">✉️</div>
<<<<<<< Updated upstream
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
=======
          <h2>{t("auth.forgotPassword.checkEmail")}</h2>
          <p>
            {t("auth.forgotPassword.emailSent")} <strong>{email}</strong>
          </p>
          <p className="note">{t("auth.forgotPassword.checkSpam")}</p>
          <AuthButton onClick={() => navigate("/login")}>
            {t("auth.forgotPassword.backToLogin")}
          </AuthButton>
          <div className="resend-link">
            <button onClick={() => setSuccess(false)} className="link-button">
              {t("auth.forgotPassword.tryAnotherEmail")}
>>>>>>> Stashed changes
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="forgot-password-header">
<<<<<<< Updated upstream
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
=======
        <h1 className="auth-title">{t("auth.forgotPassword.title")}</h1>
        <h2 className="auth-brand">S'techdy</h2>
        <p className="auth-subtitle">{t("auth.forgotPassword.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="forgot-password-form">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">{t("auth.forgotPassword.email")}</label>
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
        <AuthButton 
          type="submit" 
          loading={loading}
          disabled={loading}
        >
          Send reset link
        </AuthButton>

        <div className="back-to-login">
          <Link to="/login">← Back to login</Link>
=======
        <AuthButton type="submit" loading={loading} disabled={loading}>
          {t("auth.forgotPassword.submit")}
        </AuthButton>

        <div className="back-to-login">
          <Link to="/login">{t("auth.forgotPassword.backToLogin")}</Link>
>>>>>>> Stashed changes
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
