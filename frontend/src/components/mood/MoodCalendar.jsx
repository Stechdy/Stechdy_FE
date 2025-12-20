import React, { useState, useEffect } from 'react';
import moodService from '../../services/moodService';
import './MoodCalendar.css';

const MoodCalendar = () => {
  const [moods, setMoods] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const moodEmojis = {
    1: '😢',
    2: '😔', 
    3: '😐',
    4: '😊',
    5: '😄'
  };

  const moodLabels = {
    1: 'Upset',
    2: 'Sad',
    3: 'Normal',
    4: 'Happy',
    5: 'Very Happy'
  };

  useEffect(() => {
    loadMonthMoods();
  }, [currentMonth]);

  const loadMonthMoods = async () => {
    setLoading(true);
    try {
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const response = await moodService.getMoodEntries({
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString(),
        limit: 100
      });

      if (response.success) {
        setMoods(response.data);
      }
    } catch (error) {
      console.error('Error loading moods:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getMoodForDate = (day) => {
    if (!day) return null;
    
    return moods.find(mood => {
      // Parse mood date from backend (which is stored in Vietnam timezone)
      const moodDate = new Date(mood.date);
      
      // Get date components in UTC+7 (Vietnam timezone)
      const vietnamOffset = 7 * 60; // minutes
      const localTime = new Date(moodDate.getTime());
      
      // Compare with target date
      return localTime.getFullYear() === currentMonth.getFullYear() &&
             localTime.getMonth() === currentMonth.getMonth() &&
             localTime.getDate() === day;
    });
  };

  const handleDayClick = (day) => {
    if (!day) return;
    
    const mood = getMoodForDate(day);
    if (mood) {
      setSelectedDate(day);
      setSelectedMood(mood);
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const closeModal = () => {
    setSelectedDate(null);
    setSelectedMood(null);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="mood-calendar">
      {/* Calendar Header */}
      <div className="calendar-header">
        <button className="nav-btn" onClick={previousMonth}>←</button>
        <h2 className="calendar-title">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button className="nav-btn" onClick={nextMonth}>→</button>
      </div>

      {/* Week Days */}
      <div className="calendar-weekdays">
        {weekDays.map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {getDaysInMonth().map((day, index) => {
          const mood = getMoodForDate(day);
          const isToday = day && 
            day === new Date().getDate() &&
            currentMonth.getMonth() === new Date().getMonth() &&
            currentMonth.getFullYear() === new Date().getFullYear();
          
          return (
            <div
              key={index}
              className={`calendar-day ${!day ? 'empty' : ''} ${isToday ? 'today' : ''} ${mood ? 'has-mood' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              {day && (
                <>
                  <span className="day-number">{day}</span>
                  {mood && (
                    <span className="day-mood">{moodEmojis[mood.mood]}</span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Mood Detail Modal */}
      {selectedMood && (
        <div className="mood-modal-overlay" onClick={closeModal}>
          <div className="mood-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {selectedDate} {monthNames[currentMonth.getMonth()]}
              </h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="modal-mood">
                <span className="modal-emoji">{moodEmojis[selectedMood.mood]}</span>
                <span className="modal-label">{moodLabels[selectedMood.mood]}</span>
              </div>
              
              {selectedMood.energyLevel && (
                <div className="modal-energy">
                  <span className="modal-field-label">⚡ Energy:</span>
                  <span className="modal-field-value">{selectedMood.energyLevel}/10</span>
                </div>
              )}
              
              {selectedMood.emotionTags && selectedMood.emotionTags.length > 0 && (
                <div className="modal-emotions">
                  <span className="modal-field-label">🏷️ Emotions:</span>
                  <div className="modal-emotion-tags">
                    {selectedMood.emotionTags.map((tag, idx) => (
                      <span key={idx} className="modal-emotion-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedMood.note && (
                <div className="modal-note">
                  <span className="modal-field-label">📝 Notes:</span>
                  <p>{selectedMood.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodCalendar;
