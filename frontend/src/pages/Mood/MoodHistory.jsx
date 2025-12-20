import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
import SidebarNav from '../../components/common/SidebarNav';
import MoodCalendar from '../../components/mood/MoodCalendar';
import moodService from '../../services/moodService';
import './MoodHistory.css';

const MoodHistory = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await moodService.getMoodStats(30);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (avgMood) => {
    if (avgMood >= 4.5) return '😄';
    if (avgMood >= 3.5) return '😊';
    if (avgMood >= 2.5) return '😐';
    if (avgMood >= 1.5) return '😔';
    return '😢';
  };

  return (
    <div className="mood-history-container">
      <SidebarNav />
      <div className="mood-history-page">
      <header className="history-header">
        <h1 className="history-title">Mood History</h1>
      </header>

      <div className="history-content">
        {/* Loading State */}
        {loading && (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && stats && stats.totalEntries > 0 && (
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">{getMoodEmoji(stats.avgMood)}</div>
              <div className="stat-info">
                <span className="stat-label">Average Mood</span>
                <span className="stat-value">{stats.avgMood.toFixed(1)}/5</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <span className="stat-label">Average Energy</span>
                <span className="stat-value">{stats.avgEnergy.toFixed(1)}/10</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-label">Total Entries</span>
                <span className="stat-value">{stats.totalEntries}</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && stats && stats.totalEntries === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No Data Yet</h3>
            <p>Start tracking your mood today!</p>
            <button className="start-btn" onClick={() => navigate('/mood')}>
              Start Now
            </button>
          </div>
        )}

        {/* Calendar */}
        <div className="calendar-section">
          <h2 className="section-title">Mood Calendar</h2>
          <MoodCalendar />
        </div>

        {/* Top Emotions */}
        {!loading && stats && stats.topEmotions.length > 0 && (
          <div className="emotions-section">
            <h2 className="section-title">Common Emotions</h2>
            <div className="emotion-list">
              {stats.topEmotions.map((emotion, index) => (
                <div key={index} className="emotion-item">
                  <span className="emotion-name">{emotion.emotion}</span>
                  <div className="emotion-bar-container">
                    <div 
                      className="emotion-bar"
                      style={{ 
                        width: `${(emotion.count / stats.totalEntries) * 100}%` 
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
          onClick={() => navigate('/mood')}
          title="Add new mood entry"
        >
          <span className="fab-icon">+</span>
          <span className="fab-label">Add Mood</span>
        </button>
      </div>

      <BottomNav />
      </div>
    </div>
  );
};

export default MoodHistory;
