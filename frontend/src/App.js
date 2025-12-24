import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PublicRoute from "./components/common/PublicRoute";
import PrivateRoute from "./components/common/PrivateRoute";
import { SocketProvider } from "./context/SocketContext";

// Landing Page
import Landing from "./pages/Landing/Landing";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// Admin Auth Pages
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminForgotPassword from "./pages/Admin/AdminForgotPassword";

// Main App Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import Calendar from "./pages/Calendar/Calendar";
import Mood from "./pages/Mood/Mood";
import Account from "./pages/Account/Account";
import UserInformation from "./pages/UserInformation/UserInformation";
import SlotDetail from "./pages/SlotDetail/SlotDetail";
import MoodHistory from "./pages/Mood/MoodHistory";
import StudyTracker from "./pages/StudyTracker/StudyTracker";
import SubjectDetail from "./pages/SubjectDetail/SubjectDetail";
import Notifications from "./pages/Notifications/Notifications";

// Placeholder Admin component
const AdminDashboard = () => (
  <div style={{ padding: "40px", textAlign: "center" }}>
    <h1>Admin Dashboard</h1>
    <p>Welcome Admin!</p>
    <button
      onClick={() => {
        localStorage.clear();
        window.location.href = "/admin/login";
      }}
    >
      Logout
    </button>
  </div>
);

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          {/* Public Routes - Redirect if authenticated */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:resetToken"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Admin Public Routes */}
        <Route
          path="/admin/login"
          element={
            <PublicRoute redirectTo="/admin/dashboard">
              <AdminLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/admin/forgot-password"
          element={
            <PublicRoute redirectTo="/admin/dashboard">
              <AdminForgotPassword />
            </PublicRoute>
          }
        />

        {/* Private Routes - User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <Calendar />
            </PrivateRoute>
          }
        />
        <Route
          path="/mood"
          element={
            <PrivateRoute>
              <Mood />
            </PrivateRoute>
          }
        />
        <Route
          path="/mood/history"
          element={
            <PrivateRoute>
              <MoodHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />
        <Route
          path="/study-tracker"
          element={
            <PrivateRoute>
              <StudyTracker />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <Calendar />
            </PrivateRoute>
          }
        />
        <Route
          path="/slot-detail/:id"
          element={
            <PrivateRoute>
              <SlotDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/subject/:id"
          element={
            <PrivateRoute>
              <SubjectDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserInformation />
            </PrivateRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </SocketProvider>
  );
}

export default App;
