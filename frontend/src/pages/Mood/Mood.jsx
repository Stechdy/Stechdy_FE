import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
import './Mood.css';

const Mood = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');

  const moods = [
    { value: 5, emoji: '😄', label: 'Excellent', color: '#10B981' },
    { value: 4, emoji: '😊', label: 'Good', color: '#8AC0D5' },
    { value: 3, emoji: '😐', label: 'Okay', color: '#F59E0B' },
    { value: 2, emoji: '😔', label: 'Not Great', color: '#F97316' },
    { value: 1, emoji: '😢', label: 'Bad', color: '#EF4444' },
  ];

  const emotionTags = [
    'Happy', 'Focused', 'Motivated', 'Stressed', 'Tired', 
    'Anxious', 'Calm', 'Excited', 'Frustrated', 'Confident'
  ];

  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      alert('Please select a mood');
      return;
    }

    // TODO: Submit to API
    console.log({
      mood: selectedMood,
      emotionTags: selectedTags,
      note: note
    });

    navigate('/dashboard');
  };

  return (
    <div className="mood-container">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="page-title">Mood Tracking</h1>
        <div style={{ width: '40px' }}></div>
      </header>

      <div className="mood-content">
        <div className="mood-question">
          <h2>How are you feeling today?</h2>
          <p>Select your current mood</p>
        </div>

        <div className="mood-selector">
          {moods.map(mood => (
            <button
              key={mood.value}
              className={`mood-btn ${selectedMood === mood.value ? 'selected' : ''}`}
              onClick={() => setSelectedMood(mood.value)}
              style={{
                '--mood-color': mood.color
              }}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label">{mood.label}</span>
            </button>
          ))}
        </div>

        {selectedMood && (
          <>
            <div className="emotion-tags-section">
              <h3>What emotions are you experiencing?</h3>
              <div className="emotion-tags">
                {emotionTags.map(tag => (
                  <button
                    key={tag}
                    className={`emotion-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mood-note-section">
              <h3>Add a note (optional)</h3>
              <textarea
                className="mood-note-input"
                placeholder="How was your day? What made you feel this way?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="4"
              />
            </div>

            <button className="submit-mood-btn" onClick={handleSubmit}>
              Save Mood
            </button>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Mood;
