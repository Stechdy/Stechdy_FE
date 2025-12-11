import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './components/common/PublicRoute';
import PrivateRoute from './components/common/PrivateRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Admin Auth Pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminForgotPassword from './pages/Admin/AdminForgotPassword';

// Placeholder components
const Dashboard = () => <div style={{ padding: '40px', textAlign: 'center' }}>
  <h1>User Dashboard</h1>
  <p>Welcome to S'techdy!</p>
  <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Logout</button>
</div>;

const AdminDashboard = () => <div style={{ padding: '40px', textAlign: 'center' }}>
  <h1>Admin Dashboard</h1>
  <p>Welcome Admin!</p>
  <button onClick={() => { localStorage.clear(); window.location.href = '/admin/login'; }}>Logout</button>
</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Redirect if authenticated */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path="/reset-password/:resetToken" element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } />

        {/* Admin Public Routes */}
        <Route path="/admin/login" element={
          <PublicRoute redirectTo="/admin/dashboard">
            <AdminLogin />
          </PublicRoute>
        } />
        <Route path="/admin/forgot-password" element={
          <PublicRoute redirectTo="/admin/dashboard">
            <AdminForgotPassword />
          </PublicRoute>
        } />

        {/* Protected User Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute adminOnly={true}>
            <AdminDashboard />
          </PrivateRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
