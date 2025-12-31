import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BottomNav from "../../components/common/BottomNav";
import SidebarNav from "../../components/common/SidebarNav";
import MoodCalendar from "../../components/mood/MoodCalendar";
import moodService from "../../services/moodService";
import "./MoodHistory.css";

const MoodHistory = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState(
    localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    console.log('MoodHistory component mounted or route changed');
    loadStats();
  }, []);

  // Reload stats when returning to this page
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, reloading stats');
      loadStats();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Update language when it changes
  useEffect(() => {
    const newLang = localStorage.getItem("language") || i18n.language || "en";
    setCurrentLang(newLang);
  }, [i18n.language]);

  // Direct mapping for emotion translations
  const emotionTranslations = {
    vi: {
      Tired: "Mệt mỏi",
      Frustrated: "Thất vọng",
      Happy: "Vui vẻ",
      Excited: "Phấn khích",
      Confident: "Tự tin",
      Anxious: "Lo lắng",
      Stressed: "Căng thẳng",
      Motivated: "Có động lực",
      Overwhelmed: "Choáng ngợp",
      Calm: "Bình tĩnh",
      Sad: "Buồn",
      Energetic: "Năng động",
      Peaceful: "Yên bình",
      Angry: "Tức giận",
      Grateful: "Biết ơn",
      Hopeful: "Hy vọng",
      Confused: "Bối rối",
      Focused: "Tập trung",
      Relaxed: "Thư giãn",
      Worried: "Lo lắng",
    },
  };

  // Helper function to translate emotion names
  const translateEmotion = (emotion) => {
    // Use currentLang state
    if (currentLang.startsWith("vi") && emotionTranslations.vi[emotion]) {
      return emotionTranslations.vi[emotion];
    }
    return emotion;
  };

  const loadStats = async () => {
    try {
      console.log('Loading mood stats...');
      const response = await moodService.getMoodStats(30);
      console.log('Mood stats response:', response);
      if (response.success) {
        console.log('Stats data:', response.data);
        setStats(response.data);
      } else {
        console.warn('Stats request not successful:', response);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (avgMood) => {
    if (avgMood >= 4.5) return "😄";
    if (avgMood >= 3.5) return "😊";
    if (avgMood >= 2.5) return "😐";
    if (avgMood >= 1.5) return "😔";
    return "😢";
  };

  return (
    <div className="mood-history-container">
      <SidebarNav />
      <div className="mood-history-page">
        <header className="history-header">
          <h1 className="history-title">{t("mood.history")}</h1>
        </header>

        <div className="history-content">
          {/* Loading State */}
          {loading && (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p>{t("common.loading")}</p>
            </div>
          )}

          {/* Stats Cards */}
          {!loading && stats && stats.totalEntries > 0 && (
            <div className="stats-section">
              <div className="stat-card">
                <div className="stat-icon">{getMoodEmoji(stats.avgMood)}</div>
                <div className="stat-info">
                  <span className="stat-label">
                    {t("moodHistory.averageMood")}
                  </span>
                  <span className="stat-value">
                    {stats.avgMood.toFixed(1)}/5
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <span className="stat-label">
                    {t("moodHistory.averageEnergy")}
                  </span>
                  <span className="stat-value">
                    {stats.avgEnergy.toFixed(1)}/10
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <span className="stat-label">
                    {t("moodHistory.totalEntries")}
                  </span>
                  <span className="stat-value">{stats.totalEntries}</span>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && stats && stats.totalEntries === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>{t("moodHistory.noDataYet")}</h3>
              <p>{t("moodHistory.startTracking")}</p>
              <button className="start-btn" onClick={() => navigate("/mood")}>
                {t("moodHistory.startNow")}
              </button>
            </div>
          )}

          {/* Calendar */}
          <div className="calendar-section">
            <h2 className="section-title">{t("moodHistory.moodCalendar")}</h2>
            <MoodCalendar />
          </div>

          {/* Top Emotions */}
          {!loading && stats && stats.topEmotions.length > 0 && (
            <div className="emotions-section">
              <h2 className="section-title">
                {t("moodHistory.commonEmotions")}
              </h2>
              <div className="emotion-list">
                {stats.topEmotions.map((emotion, index) => (
                  <div key={index} className="emotion-item">
                    <span className="emotion-name">
                      {translateEmotion(emotion.emotion)}
                    </span>
                    <div className="emotion-bar-container">
                      <div
                        className="emotion-bar"
                        style={{
                          width: `${
                            (emotion.count / stats.totalEntries) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="emotion-count">{emotion.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Mood Button */}
          <button
            className="add-mood-fab"
            onClick={() => navigate("/mood")}
            title={t("moodHistory.addNewEntry")}
          >
            <span className="fab-icon">+</span>
            <span className="fab-label">{t("moodHistory.addMood")}</span>
          </button>
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default MoodHistory;
