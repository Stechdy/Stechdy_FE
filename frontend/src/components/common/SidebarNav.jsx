import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moodService from "../../services/moodService";
import "./SidebarNav.css";

const SidebarNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [hasTodayMood, setHasTodayMood] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    checkTodayMood();
  }, []);

  const checkTodayMood = async () => {
    try {
      const response = await moodService.getTodayMood();
      setHasTodayMood(response.success && response.data);
    } catch (error) {
      console.error("Error checking today mood:", error);
      setHasTodayMood(false);
    }
  };

  const handleMoodClick = () => {
    if (hasTodayMood) {
      navigate("/mood/history");
    } else {
      navigate("/mood");
    }
  };

  const isActive = (path) => {
    console.log(`SidebarNav - checking path: ${path}, current location: ${location.pathname}`);
    
    // Check for exact match
    if (location.pathname === path) {
      console.log(`SidebarNav - isActive: ${path} matches ${location.pathname}`);
      return true;
    }
    
    // Check for mood paths
    if (path === "/mood" && (location.pathname === "/mood" || location.pathname === "/mood/history")) {
      console.log(`SidebarNav - isActive: ${path} matches mood path ${location.pathname}`);
      return true;
    }
    
    // Check for account/profile paths
    if (path === "/account" && (location.pathname === "/account" || location.pathname === "/profile")) {
      console.log(`SidebarNav - isActive: ${path} matches account path ${location.pathname}`);
      return true;
    }
    
    console.log(`SidebarNav - ${path} is NOT active`);
    return false;
  };

  const navItems = [
    {
      path: "/dashboard",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      labelKey: "sidebarNav.dashboard",
    },
    {
      path: "/calendar",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 2V6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 2V6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 10H21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      labelKey: "sidebarNav.calendar",
    },
    {
      path: "/ai",
      icon: (
        <div className="ai-fab">
          <img 
            src={require("../../assets/STECHDY.webp")} 
            alt="S'Techdy AI" 
            style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '8px' }}
          />
        </div>
      ),
      labelKey: "sidebarNav.ai",
    },
    {
      path: "/mood",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="9" cy="9" r="1" fill="currentColor" />
          <circle cx="15" cy="9" r="1" fill="currentColor" />
        </svg>
      ),
      labelKey: "sidebarNav.mood",
    },
    {
      path: "/account",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      labelKey: "sidebarNav.account",
    },
  ];

  return (
    <>
      {/* Backdrop overlay when expanded */}
      <div 
        className={`sidebar-backdrop ${isExpanded ? "active" : ""}`}
        onClick={() => setIsExpanded(false)}
      />
      
      {/* Sidebar navigation */}
      <nav 
        className={`sidebar-nav ${isExpanded ? "expanded" : ""}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="sidebar-content">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => item.path === "/mood" ? handleMoodClick() : navigate(item.path)}
            >
              <div className="nav-item-icon">
                {item.icon}
              </div>
              <span className="nav-item-label">{t(item.labelKey)}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default SidebarNav;
