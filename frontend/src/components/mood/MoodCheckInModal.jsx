import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MoodCheckInModal.css';

const MoodCheckInModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckIn = () => {
    onClose();
    navigate('/mood');
  };

  const handleSkip = () => {
    localStorage.setItem('moodCheckInSkipped', new Date().toDateString());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleSkip}>
      <div className="check-in-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-emoji-large">😊</div>
        
        <h2 className="modal-title">
          How are you feeling today?
        </h2>
        
        <p className="modal-description">
          Take a few seconds to record your mood.
          Tracking your emotions helps you understand yourself better!
        </p>

        <div className="modal-actions">
          <button className="check-in-btn" onClick={handleCheckIn}>
            Record my mood 💙
          </button>
          
          <button className="skip-btn" onClick={handleSkip}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodCheckInModal;
