import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/study-tracker';
    }
    if (path === '/calendar') {
      return location.pathname === '/calendar' || location.pathname.startsWith('/slot-detail');
    }
    return location.pathname === path;
  };

  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
        onClick={() => navigate('/dashboard')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="currentColor"/>
        </svg>
        <span>Dashboard</span>
      </button>

      <button 
        className={`nav-item ${isActive('/calendar') ? 'active' : ''}`}
        onClick={() => navigate('/calendar')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="currentColor"/>
        </svg>
        <span>Calendar</span>
      </button>

      <button 
        className="nav-item nav-item-ai"
        onClick={() => navigate('/ai')}
      >
        <div className="ai-fab">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="white"/>
          </svg>
        </div>
        <span>AI</span>
      </button>

      <button 
        className={`nav-item ${isActive('/mood') ? 'active' : ''}`}
        onClick={() => navigate('/mood')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM15.5 11C16.33 11 17 10.33 17 9.5C17 8.67 16.33 8 15.5 8C14.67 8 14 8.67 14 9.5C14 10.33 14.67 11 15.5 11ZM8.5 11C9.33 11 10 10.33 10 9.5C10 8.67 9.33 8 8.5 8C7.67 8 7 8.67 7 9.5C7 10.33 7.67 11 8.5 11ZM12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z" fill="currentColor"/>
        </svg>
        <span>Mood</span>
      </button>

      <button 
        className={`nav-item ${isActive('/account') ? 'active' : ''}`}
        onClick={() => navigate('/account')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 20C9.97 20 7.57 19.18 5.86 17.12C8.55 15.8 11.68 15.8 14.14 17.12C12.43 19.18 10.03 20 12 20Z" fill="currentColor"/>
        </svg>
        <span>Account</span>
      </button>
    </nav>
  );
};

export default BottomNav;
