import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
import SidebarNav from '../../components/common/SidebarNav';
import moodService from '../../services/moodService';
import './Mood.css';

const Mood = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [todayMood, setTodayMood] = useState(null);
  const [iconAnimate, setIconAnimate] = useState(false);

  // Mood options theo mockup
  const moods = [
    { value: 1, emoji: '😢', label: 'Upset' },
    { value: 2, emoji: '😔', label: 'Sad' },
    { value: 3, emoji: '😐', label: 'Normal' },
    { value: 4, emoji: '😊', label: 'Happy' },
    { value: 5, emoji: '😄', label: 'Very Happy' },
  ];

  // Energy icons based on level
  const getEnergyIcon = (level) => {
    if (level <= 2) return '🔋'; // Very low
    if (level <= 4) return '🪫'; // Low
    if (level <= 6) return '🔌'; // Medium
    if (level <= 8) return '⚡'; // High
    return '✨'; // Very high
  };

  useEffect(() => {
    loadTodayMood();
  }, []);

  const loadTodayMood = async () => {
    try {
      const response = await moodService.getTodayMood();
      if (response.success && response.data) {
        setTodayMood(response.data);
        setSelectedMood(response.data.mood);
        setNote(response.data.note || '');
        setEnergyLevel(response.data.energyLevel || 5);
      }
    } catch (error) {
      console.error('Error loading today mood:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      alert('Please select your mood');
      return;
    }

    setLoading(true);
    try {
      const response = await moodService.createMoodEntry({
        mood: selectedMood,
        note: note.trim(),
        energyLevel: energyLevel
      });

      if (response.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/mood/history');
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      alert('An error occurred while saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mood-page-container">
      <SidebarNav />
      <div className="mood-page">
      {/* Success notification */}
      {showSuccess && (
        <div className="success-toast">
          Mood saved successfully 💙
        </div>
      )}

      <header className="mood-header">
        <h1 className="mood-title">Mood Tracking</h1>
        <button className="history-btn" onClick={() => navigate('/mood/history')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.25 15.52L17.02 14.24L13.5 12.15V8H12Z" fill="#5ECFB1"/>
          </svg>
        </button>
      </header>

      <div className="mood-content">
        <p className="mood-question">How are you feeling today?</p>

        {/* Mood Selector */}
        <div className="mood-selector">
          {moods.map(mood => (
            <button
              key={mood.value}
              className={`mood-option ${selectedMood === mood.value ? 'selected' : ''}`}
              onClick={() => setSelectedMood(mood.value)}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label">{mood.label}</span>
            </button>
          ))}
        </div>

        {/* Note Section */}
        <div className="note-section">
          <label className="section-label">Notes</label>
          <textarea
            className="note-input"
            placeholder="Write about your feelings today..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="3"
            maxLength={500}
          />
          <div className="char-count">{note.length}/500</div>
        </div>

        {/* Energy Level Slider */}
        <div className="energy-section">
          <div className="section-header">
            <label className="section-label">Energy Level</label>
            <span className="energy-value">{energyLevel}/10</span>
          </div>
          <div className="energy-slider-container">
            <div className="slider-wrapper">
              <span className="slider-label">Low</span>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => {
                  setEnergyLevel(parseInt(e.target.value));
                  setIconAnimate(true);
                  setTimeout(() => setIconAnimate(false), 500);
                }}
                className="energy-slider"
              />
              <span className="slider-label">High</span>
            </div>
            <div className={`energy-icon ${iconAnimate ? 'animate' : ''}`}>
              {getEnergyIcon(energyLevel)}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          className="submit-btn" 
          onClick={handleSubmit}
          disabled={!selectedMood || loading}
        >
          {loading ? 'Saving...' : 'Save Today\'s Mood 💖'}
        </button>
      </div>

      <BottomNav />
      </div>
    </div>
  );
};

export default Mood;
