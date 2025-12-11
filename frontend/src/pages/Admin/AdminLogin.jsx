import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import AuthInput from '../../components/common/AuthInput';
import AuthButton from '../../components/common/AuthButton';
import { login } from '../../services/authService';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
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
    setApiError('');

    try {
      const response = await login(formData.email, formData.password);
      
      if (response.success) {
        // Check if user is admin
        if (response.data.role !== 'admin' && response.data.role !== 'moderator') {
          setApiError('Truy cập bị từ chối. Yêu cầu quyền quản trị.');
          setLoading(false);
          return;
        }

        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      }
    } catch (error) {
      setApiError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="admin-badge">
        <span>🛡️ Cổng Quản Trị</span>
      </div>

      <div className="admin-login-header">
        <h1 className="auth-title">Truy cập Quản trị</h1>
        <h2 className="auth-brand">S'techdy</h2>
        <p className="auth-subtitle">Đăng nhập để truy cập trang quản trị</p>
      </div>

      <form onSubmit={handleSubmit} className="admin-login-form">
        {apiError && (
          <div className="alert alert-error">
            {apiError}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email Quản trị</label>
          <AuthInput
            type="email"
            name="email"
            placeholder="admin@stechdy.com"
            value={formData.email}
            onChange={handleChange}
            icon="👤"
            error={errors.email}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mật khẩu</label>
          <AuthInput
            type={showPassword ? 'text' : 'password'}
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
          <Link to="/admin/forgot-password">Quên mật khẩu?</Link>
        </div>

        <AuthButton 
          type="submit" 
          loading={loading}
          disabled={loading}
        >
          Đăng nhập với tư cách Quản trị
        </AuthButton>

        <div className="user-portal-link">
          <Link to="/login">← Quay lại cổng người dùng</Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default AdminLogin;
