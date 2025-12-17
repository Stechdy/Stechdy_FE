import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
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
    <div className="mood-history-page">
      <header className="history-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ←
        </button>
        <h1 className="history-title">Lịch sử cảm xúc</h1>
        <div style={{ width: '40px' }}></div>
      </header>

      <div className="history-content">
        {/* Loading State */}
        {loading && (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && stats && stats.totalEntries > 0 && (
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">{getMoodEmoji(stats.avgMood)}</div>
              <div className="stat-info">
                <span className="stat-label">Tâm trạng trung bình</span>
                <span className="stat-value">{stats.avgMood.toFixed(1)}/5</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <span className="stat-label">Năng lượng trung bình</span>
                <span className="stat-value">{stats.avgEnergy.toFixed(1)}/10</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-label">Số lần ghi nhận</span>
                <span className="stat-value">{stats.totalEntries}</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && stats && stats.totalEntries === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>Chưa có dữ liệu</h3>
            <p>Hãy bắt đầu ghi nhận cảm xúc của bạn hôm nay!</p>
            <button className="start-btn" onClick={() => navigate('/mood')}>
              Bắt đầu ngay
            </button>
          </div>
        )}

        {/* Calendar */}
        <div className="calendar-section">
          <h2 className="section-title">Lịch theo dõi</h2>
          <MoodCalendar />
        </div>

        {/* Top Emotions */}
        {!loading && stats && stats.topEmotions.length > 0 && (
          <div className="emotions-section">
            <h2 className="section-title">Cảm xúc phổ biến</h2>
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
        >
          +
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default MoodHistory;
