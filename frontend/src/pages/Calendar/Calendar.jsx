import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
import { getVietnamTime, getVietnamDate } from '../../utils/helpers';
import './Calendar.css';

const Calendar = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(getVietnamDate());
  const [weekOffset, setWeekOffset] = useState(0);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessionsForDate(selectedDate);
  }, [selectedDate]);

  const fetchSessionsForDate = async (date) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);

      const response = await fetch(
        `http://localhost:3001/api/study-sessions/today?start=${dateStart.toISOString()}&end=${dateEnd.toISOString()}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Map subjectId to subjectInfo for consistency
        const mappedData = data.map(session => ({
          ...session,
          subjectInfo: session.subjectId || null
        }));
        setSessions(mappedData);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return { text: 'Completed', color: '#10B981' };
      case 'missed':
        return { text: 'Missed', color: '#EF4444' };
      case 'scheduled':
        return { text: 'Scheduled', color: '#8AC0D5' };
      default:
        return { text: 'Unknown', color: '#9CA3AF' };
    }
  };

  const getTimeSlotIcon = (timeSlot) => {
    switch (timeSlot) {
      case 'Morning':
        return '☀️';
      case 'Afternoon':
        return '🌤️';
      case 'Evening':
        return '🌙';
      default:
        return '📅';
    }
  };

  const getWeekDays = () => {
    const start = getVietnamDate();
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday
    start.setDate(diff + (weekOffset * 7));

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const weekDays = getWeekDays();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        <div className="calendar-title-wrapper">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1>Calendar</h1>
        </div>
        <button className="notification-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#E85D75"/>
          </svg>
          <span className="notification-badge"></span>
        </button>
      </header>

      <main className="calendar-main">
        {/* Week Calendar */}
        <div className="week-calendar-container">
          <div className="week-header">
            <div className="month-year">{monthNames[weekDays[0].getMonth()]} {weekDays[0].getFullYear()}</div>
            <div className="week-navigation">
              <button onClick={() => setWeekOffset(weekOffset - 1)}>‹</button>
              <span>Week {getWeekNumber(weekDays[0])}</span>
              <button onClick={() => setWeekOffset(weekOffset + 1)}>›</button>
            </div>
          </div>
          <div className="week-calendar">
          {weekDays.map((date, idx) => {
            const isToday = date.toDateString() === getVietnamDate().toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            return (
              <div
                key={idx}
                className={`week-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className="day-name">{dayNames[idx]}</span>
                <span className="day-number">{date.getDate()}</span>
              </div>
            );
          })}
          </div>
        </div>

        {/* Today's Sessions */}
        <div className="sessions-section">
          <h2 className="section-title">
            {selectedDate.toDateString() === getVietnamDate().toDateString() 
              ? `Today, ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
              : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </h2>
          <p className="sessions-count">{sessions.length} study session{sessions.length !== 1 ? 's' : ''} scheduled</p>

          <div className="sessions-list">
            {sessions.length === 0 ? (
              <div className="no-sessions">
                <p>No sessions scheduled for this day</p>
              </div>
            ) : (
              sessions.map((session) => {
                const statusBadge = getStatusBadge(session.status);
                
                return (
                  <div 
                    key={session._id} 
                    className="session-card"
                    onClick={() => navigate(`/slot-detail/${session._id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div 
                      className="session-icon"
                      style={{ 
                        background: session.subjectInfo?.color || '#8AC0D5'
                      }}
                    >
                      {getTimeSlotIcon(session.timeSlot)}
                    </div>
                    <div className="session-content">
                      <div className="session-header">
                        <div className="session-header-left">
                          <h3 className="session-title">{session.timeSlot}</h3>
                          <p className="session-time">{session.startTime} - {session.endTime}</p>
                        </div>
                        <span 
                          className="status-badge" 
                          style={{ color: statusBadge.color }}
                        >
                          {statusBadge.text}
                        </span>
                      </div>
                      <div className="session-footer">
                        <span className="session-subject">
                          📚 {session.subjectInfo?.subjectName || 'No subject'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Calendar;