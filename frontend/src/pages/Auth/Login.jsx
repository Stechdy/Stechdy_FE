import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import AuthLayout from "../../components/layout/AuthLayout";
import AuthInput from "../../components/common/AuthInput";
import AuthButton from "../../components/common/AuthButton";
import { login, googleLogin } from "../../services/authService";
import "./Login.css";

const GOOGLE_CLIENT_ID =
  process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  "944831618827-2qgcaei2lpcko6ucl9lj9m21llvkj7nn.apps.googleusercontent.com";

const Login = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
<<<<<<< Updated upstream
      newErrors.email = 'Please enter email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter password';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
=======
      newErrors.email = t("auth.validation.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("auth.validation.emailInvalid");
    }

    if (!formData.password) {
      newErrors.password = t("auth.validation.passwordRequired");
    } else if (formData.password.length < 6) {
      newErrors.password = t("auth.validation.passwordMinLength");
>>>>>>> Stashed changes
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const response = await login(formData.email, formData.password);

      if (response.success) {
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));

        // Redirect based on role
        if (response.data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
<<<<<<< Updated upstream
      setApiError(error.message || 'Login failed. Please try again.');
=======
      setApiError(error.message || t("auth.login.loginFailed"));
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setLoading(true);
      setApiError("");

      const response = await googleLogin(credentialResponse.credential);

      if (response.success) {
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));

        // Redirect based on role
        if (response.data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
<<<<<<< Updated upstream
      setApiError(error.message || 'Google login failed. Please try again.');
=======
      setApiError(error.message || t("auth.login.googleLoginFailed"));
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
<<<<<<< Updated upstream
    setApiError('Google login failed. Please try again.');
=======
    setApiError(t("auth.login.googleLoginFailed"));
>>>>>>> Stashed changes
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthLayout>
        <form onSubmit={handleSubmit} className="login-form">
<<<<<<< Updated upstream
          {apiError && (
            <div className="login-alert login-alert-error">
              {apiError}
            </div>
          )}

          <div className="login-form-group">
            <label className="login-form-label">Email</label>
=======
          {apiError && <div className="alert alert-error">{apiError}</div>}

          <div className="form-group">
            <label className="form-label">{t("auth.login.email")}</label>
>>>>>>> Stashed changes
            <AuthInput
              type="email"
              name="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              icon="📧"
              error={errors.email}
            />
          </div>

<<<<<<< Updated upstream
          <div className="login-form-group">
            <label className="login-form-label">Password</label>
=======
          <div className="form-group">
            <label className="form-label">{t("auth.login.password")}</label>
>>>>>>> Stashed changes
            <AuthInput
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon="🔒"
              error={errors.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
          </div>

          <div className="forgot-password-link">
<<<<<<< Updated upstream
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <AuthButton 
            type="submit" 
            loading={loading}
            disabled={loading}
          >
            Login
          </AuthButton>

          <div className="login-divider">
            <span>or continue with</span>
=======
            <Link to="/forgot-password">{t("auth.login.forgotPassword")}</Link>
          </div>

          <AuthButton type="submit" loading={loading} disabled={loading}>
            {t("auth.login.submit")}
          </AuthButton>

          <div className="divider">
            <span>{t("auth.login.orContinueWith")}</span>
>>>>>>> Stashed changes
          </div>

          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
<<<<<<< Updated upstream
              locale="en"
=======
              locale={i18n.language}
>>>>>>> Stashed changes
              width="100%"
            />
          </div>

          <div className="signup-link">
<<<<<<< Updated upstream
            Don't have an account?{' '}
            <Link to="/register">Sign up now</Link>
=======
            {t("auth.login.noAccount")}{" "}
            <Link to="/register">{t("auth.login.signUpNow")}</Link>
>>>>>>> Stashed changes
          </div>
        </form>
      </AuthLayout>
    </GoogleOAuthProvider>
  );
};

export default Login;
