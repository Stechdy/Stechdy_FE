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
      setError('Vui lòng nhập email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email không hợp lệ');
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
      setError(err.message || 'Không thể gửi email. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="success-message">
          <div className="success-icon">✉️</div>
          <h2>Kiểm tra Email của bạn</h2>
          <p>
            Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{email}</strong>. 
            Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
          </p>
          <p className="note">
            Không nhận được email? Kiểm tra thư mục spam hoặc thử lại.
          </p>
          <AuthButton onClick={() => navigate('/login')}>
            Quay lại đăng nhập
          </AuthButton>
          <div className="resend-link">
            <button onClick={() => setSuccess(false)} className="link-button">
              Thử email khác
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="forgot-password-header">
        <h1 className="auth-title">Quên mật khẩu?</h1>
        <h2 className="auth-brand">S'techdy</h2>
        <p className="auth-subtitle">
          Nhập địa chỉ email và chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="forgot-password-form">
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email</label>
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
          Gửi link đặt lại
        </AuthButton>

        <div className="back-to-login">
          <Link to="/login">← Quay lại đăng nhập</Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
