import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import BottomNav from "../../components/common/BottomNav";
import SidebarNav from "../../components/common/SidebarNav";
import "./Account.css";

const Account = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const { themeMode, setThemeMode, resolvedTheme } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const themeOptions = [
    { value: "light", label: t("theme.light"), icon: "☀️" },
    { value: "dark", label: t("theme.dark"), icon: "🌙" },
    { value: "system", label: t("theme.system"), icon: "💻" },
  ];

  const getThemeLabel = () => {
    const option = themeOptions.find((opt) => opt.value === themeMode);
    return option ? `${option.icon} ${option.label}` : t("theme.system");
  };

  return (
    <div className="account-page">
      <SidebarNav />
      <div className="account-wrapper">
        <div className="account-content">
          {/* Profile Header */}
          <div className="profile-header">
            <img
              src={userData.avatarUrl || "https://i.pravatar.cc/150?img=5"}
              alt="Profile"
              className="profile-large-avatar"
            />
            <div className="profile-info">
              <h2 className="profile-name">
                {userData.name || "Sarah Johnson"}
              </h2>
              <div className="premium-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z"
                    fill="currentColor"
                  />
                </svg>
                <span>{t("account.freePlan")}</span>
              </div>
            </div>
          </div>

          {/* Upgrade to Premium Card */}
          <div
            className="premium-card gradient-card"
            onClick={() => navigate("/pricing")}
            style={{ cursor: "pointer" }}
          >
            <div className="premium-icon">💎</div>
            <span className="premium-text">{t("account.upgradePremium")}</span>
          </div>

          <div className="account-main-grid">
            {/* Settings Section */}
            <div className="settings-section">
              <h3 className="section-title">{t("account.settings")}</h3>

              <button
                className="settings-item"
                onClick={() => navigate("/profile")}
              >
                <span className="settings-label">
                  {t("account.userInformation")}
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className="settings-item"
                onClick={() => setShowThemeModal(true)}
              >
                <div className="settings-item-left">
                  <span className="settings-label">
                    {t("account.appearance")}
                  </span>
                  <span className="settings-value">{getThemeLabel()}</span>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className="settings-item"
                onClick={() => navigate("/notifications")}
              >
                <span className="settings-label">
                  {t("account.soundNotifications")}
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Support Section */}
            <div className="support-section">
              <h3 className="section-title">{t("account.support")}</h3>

              <button
                className="settings-item"
                onClick={() => navigate("/help")}
              >
                <span className="settings-label">
                  {t("account.helpSupport")}
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className="settings-item"
                onClick={() => navigate("/about")}
              >
                <span className="settings-label">{t("account.aboutUs")}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className="settings-item"
                onClick={() => navigate("/terms")}
              >
                <span className="settings-label">
                  {t("account.termsOfUse")}
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <button className="logout-button" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17L21 12L16 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{t("account.logout")}</span>
          </button>
        </div>

        {/* Theme Selection Modal */}
        {showThemeModal && (
          <div
            className="theme-modal-overlay"
            onClick={() => setShowThemeModal(false)}
          >
            <div className="theme-modal" onClick={(e) => e.stopPropagation()}>
              <div className="theme-modal-header">
                <h3>{t("theme.chooseTheme")}</h3>
                <button
                  className="theme-modal-close"
                  onClick={() => setShowThemeModal(false)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="theme-options">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`theme-option ${
                      themeMode === option.value ? "active" : ""
                    }`}
                    onClick={() => {
                      setThemeMode(option.value);
                      setShowThemeModal(false);
                    }}
                  >
                    <span className="theme-option-icon">{option.icon}</span>
                    <span className="theme-option-label">{option.label}</span>
                    {themeMode === option.value && (
                      <svg
                        className="theme-option-check"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              {themeMode === "system" && (
                <p className="theme-system-note">
                  {t("theme.currentlyUsing")}:{" "}
                  {resolvedTheme === "dark"
                    ? `🌙 ${t("theme.dark")}`
                    : `☀️ ${t("theme.light")}`}{" "}
                  ({t("account.systemSettings")})
                </p>
              )}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default Account;
