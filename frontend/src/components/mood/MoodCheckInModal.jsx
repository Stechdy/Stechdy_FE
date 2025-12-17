import React, { useState, useEffect } from 'react';
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
          Bạn cảm thấy hôm nay thế nào?
        </h2>
        
        <p className="modal-description">
          Hãy dành vài giây để ghi lại cảm xúc của bạn. 
          Việc theo dõi tâm trạng giúp bạn hiểu rõ hơn về bản thân!
        </p>

        <div className="modal-actions">
          <button className="check-in-btn" onClick={handleCheckIn}>
            Ghi lại cảm xúc 💙
          </button>
          
          <button className="skip-btn" onClick={handleSkip}>
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodCheckInModal;
