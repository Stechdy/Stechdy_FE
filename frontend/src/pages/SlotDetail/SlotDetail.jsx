import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
import SidebarNav from '../../components/common/SidebarNav';
import { getVietnamTime, getVietnamDate } from '../../utils/helpers';
import './SlotDetail.css';

const SlotDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [weekSessions, setWeekSessions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    subjectId: '',
    startTime: '',
    endTime: '',
    status: ''
  });
  const [selectedMoveDate, setSelectedMoveDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [moveStartTime, setMoveStartTime] = useState('');
  const [moveEndTime, setMoveEndTime] = useState('');
  const [selectedDateSessions, setSelectedDateSessions] = useState([]);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveModalData, setMoveModalData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    fetchSessionDetail();
    fetchSubjects();
    fetchWeekSessions();
  }, [id]);

  useEffect(() => {
    if (selectedMoveDate) {
      fetchSessionsForSelectedDate(new Date(selectedMoveDate));
    } else {
      setSelectedDateSessions([]);
    }
  }, [selectedMoveDate]);

  const fetchSessionDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/study-sessions/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSession(data);
        setEditData({
          subjectId: data.subjectId?._id || '',
          startTime: data.startTime,
          endTime: data.endTime,
          status: data.status
        });
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/subjects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchWeekSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/study-sessions/week?offset=0', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // Ensure weekSessions is always an array
        const sessions = Array.isArray(data) ? data : (data.sessions || []);
        setWeekSessions(sessions);
      }
    } catch (error) {
      console.error('Error fetching week sessions:', error);
      setWeekSessions([]);
    }
  };

  const fetchSessionsForSelectedDate = async (date) => {
    try {
      const token = localStorage.getItem('token');
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
        // Check if data is array or nested object
        const sessions = Array.isArray(data) ? data : (data.sessions || []);
        setSelectedDateSessions(sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions for selected date:', error);
      setSelectedDateSessions([]);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/study-sessions/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        fetchSessionDetail();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const handleCancel = () => {
    setConfirmAction({
      type: 'missed',
      title: 'Mark as Missed',
      message: 'Are you sure you want to mark this session as missed?',
      confirmText: 'Yes, Mark as Missed',
      action: async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3001/api/study-sessions/${id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'missed' })
          });

          if (response.ok) {
            navigate('/calendar');
          }
        } catch (error) {
          console.error('Error updating session:', error);
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleDelete = () => {
    setConfirmAction({
      type: 'delete',
      title: 'Delete Slot',
      message: 'Are you sure you want to delete this slot? This action cannot be undone.',
      confirmText: 'Yes, Delete',
      action: async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3001/api/study-sessions/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (response.ok) {
            navigate('/calendar');
          }
        } catch (error) {
          console.error('Error deleting session:', error);
        }
      }
    });
    setShowConfirmModal(true);
  };

  const canMoveSession = () => {
    // Get current time in Vietnam timezone (UTC+7)
    const vietnamTime = getVietnamTime();
    
    // Get session date and start time
    const sessionDate = new Date(session.date);
    const [startHour, startMinute] = (session.startTime || '00:00').split(':').map(Number);
    sessionDate.setHours(startHour, startMinute, 0, 0);
    
    // Check if session start time has passed
    if (vietnamTime > sessionDate) {
      return false;
    }
    
    // Check if session is completed or missed
    if (session.status === 'completed' || session.status === 'missed') {
      return false;
    }
    return true;
  };

  const determineTimeSlot = (startTime) => {
    const hour = parseInt(startTime.split(':')[0]);
    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 18) return 'Afternoon';
    return 'Evening';
  };

  const handleMoveClick = () => {
    if (!selectedMoveDate || !selectedTimeSlot || !moveStartTime || !moveEndTime) {
      return;
    }
    if (!canMoveSession()) {
      return;
    }

    const moveDate = new Date(selectedMoveDate);

    const subjectName = session.subjectId?.subjectName || 'this session';
    const oldDate = new Date(session.date).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' });
    const newDate = moveDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' });
    
    const modalData = {
      subjectName,
      oldDate,
      oldTimeSlot: session.timeSlot || session.sessionType,
      oldStartTime: session.startTime,
      oldEndTime: session.endTime,
      newDate,
      newTimeSlot: selectedTimeSlot,
      newStartTime: moveStartTime,
      newEndTime: moveEndTime,
      targetDate: moveDate,
      targetTimeSlot: selectedTimeSlot
    };
    
    setMoveModalData(modalData);
    setShowMoveModal(true);
  };

  const confirmMove = async () => {
    if (!moveModalData) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/study-sessions/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: moveModalData.targetDate,
          timeSlot: moveModalData.newTimeSlot,
          startTime: moveModalData.newStartTime,
          endTime: moveModalData.newEndTime
        })
      });

      if (response.ok) {
        setShowMoveModal(false);
        setTimeout(() => navigate('/calendar'), 300);
      }
    } catch (error) {
      console.error('Error moving session:', error);
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

  const getTimeRangesForSlot = (timeSlot) => {
    switch (timeSlot) {
      case 'Morning':
        return [
          { start: '06:00', end: '07:30', label: '6:00 - 7:30 AM' },
          { start: '07:30', end: '09:00', label: '7:30 - 9:00 AM' },
          { start: '09:00', end: '10:30', label: '9:00 - 10:30 AM' },
          { start: '10:30', end: '12:00', label: '10:30 AM - 12:00 PM' }
        ];
      case 'Afternoon':
        return [
          { start: '12:00', end: '13:30', label: '12:00 - 1:30 PM' },
          { start: '13:30', end: '15:00', label: '1:30 - 3:00 PM' },
          { start: '15:00', end: '16:30', label: '3:00 - 4:30 PM' },
          { start: '16:30', end: '18:00', label: '4:30 - 6:00 PM' }
        ];
      case 'Evening':
        return [
          { start: '18:00', end: '19:30', label: '6:00 - 7:30 PM' },
          { start: '19:30', end: '21:00', label: '7:30 - 9:00 PM' },
          { start: '21:00', end: '22:30', label: '9:00 - 10:30 PM' }
        ];
      default:
        return [];
    }
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDate();
  };

  const isSlotOccupied = (date, timeSlot) => {
    if (!Array.isArray(selectedDateSessions)) return false;
    const normalizedTimeSlot = timeSlot.toLowerCase();
    const occupied = selectedDateSessions.some(s => {
      const sessionTimeSlot = (s.timeSlot || s.sessionType || '').toLowerCase();
      return sessionTimeSlot === normalizedTimeSlot && s._id !== id;
    });
    return occupied;
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = getVietnamDate();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getSlotsForDate = (date) => {
    if (!date) return [];
    const timeSlots = ['Morning', 'Afternoon', 'Evening'];
    const now = getVietnamTime();
    const selectedDate = new Date(date);
    selectedDate.setHours(23, 59, 59, 999);
    
    return timeSlots.map(timeSlot => ({
      timeSlot,
      occupied: isSlotOccupied(date, timeSlot),
      isCurrent: new Date(session.date).toDateString() === new Date(date).toDateString() && 
                 (session.timeSlot || session.sessionType) === timeSlot,
      isPast: selectedDate < now && !canMoveSession()
    }));
  };

  if (!session) {
    return <div className="loading">Loading...</div>;
  }

  const timeSlots = ['Morning', 'Afternoon', 'Evening'];
  const weekDays = [];
  const today = new Date();
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + mondayOffset + i);
    weekDays.push(date);
  }

  return (
    <div className="slot-detail-container">
      <SidebarNav />
      <div className="slot-detail-page">
      <header className="slot-detail-header">
        <h1 className="slot-detail-title">Slot Details</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="slot-detail-main">
        {/* Session Info Card */}
        <div className="slot-info-card">
          <div className="slot-info-header">
            <div 
              className="slot-info-icon"
              style={{ background: session.subjectId?.color || '#8AC0D5' }}
            >
              {getTimeSlotIcon(session.timeSlot)}
            </div>
            <div className="slot-info-title">
              <h2>{session.timeSlot} Session</h2>
              <p>{new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {!isEditing ? (
            <div className="slot-info-content">
              <div className="slot-info-row">
                <span className="slot-info-label">Subject</span>
                <span className="slot-info-value">📚 {session.subjectId?.subjectName || 'No subject'}</span>
              </div>
              <div className="slot-info-row">
                <span className="slot-info-label">Time</span>
                <span className="slot-info-value">🕐 {session.startTime} - {session.endTime}</span>
              </div>
              <div className="slot-info-row">
                <span className="slot-info-label">Status</span>
                <span className={`slot-info-value status-${session.status}`}>
                  {session.status === 'completed' ? '✓ Completed' : 
                   session.status === 'missed' ? '❌ Missed' :
                   '⏱ Scheduled'}
                </span>
              </div>
              {canMoveSession() && (
                <button className="slot-edit-btn" onClick={() => setIsEditing(true)}>
                  <span className="btn-icon">✏️</span>
                  <span>Edit Details</span>
                </button>
              )}
            </div>
          ) : (
            <div className="slot-edit-form">
              <div className="slot-form-group">
                <label>📚 Subject</label>
                <select 
                  value={editData.subjectId} 
                  onChange={(e) => setEditData({...editData, subjectId: e.target.value})}
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="slot-form-group">
                <label>🕐 Start Time</label>
                <input 
                  type="time" 
                  value={editData.startTime}
                  onChange={(e) => setEditData({...editData, startTime: e.target.value})}
                />
              </div>
              <div className="slot-form-group">
                <label>🕐 End Time</label>
                <input 
                  type="time" 
                  value={editData.endTime}
                  onChange={(e) => setEditData({...editData, endTime: e.target.value})}
                />
              </div>
              <div className="slot-form-actions">
                <button className="slot-save-btn" onClick={handleSave}>
                  <span className="btn-icon">💾</span>
                  <span>Save Changes</span>
                </button>
                <button className="slot-cancel-btn" onClick={() => setIsEditing(false)}>
                  <span className="btn-icon">✕</span>
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Move Slot Section */}
        {canMoveSession() && (
        <div className="move-slot-section">
          <h3>Move to Another Slot</h3>
          <p className="section-subtitle">Select a date, then choose an available time slot</p>

          {/* Date Selector */}
          <div className="date-selector">
            <label>📅 Select Date:</label>
            <select 
              value={selectedMoveDate} 
              onChange={(e) => {
                setSelectedMoveDate(e.target.value);
                setSelectedTimeSlot('');
                setMoveStartTime('');
                setMoveEndTime('');
              }}
            >
              <option value="">-- Choose a date --</option>
              {getAvailableDates().map((date, idx) => {
                const dateValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                return (
                  <option key={idx} value={dateValue}>
                    {date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Time Slot Selector */}
          {selectedMoveDate && (
            <div className="time-slot-selector">
              <label>⏰ Select Time Slot:</label>
              <div className="slot-options">
                {getSlotsForDate(new Date(selectedMoveDate)).map((slot, idx) => {
                  const isDisabled = slot.occupied || slot.isCurrent || slot.isPast;
                  return (
                    <button
                      key={idx}
                      className={`slot-option ${selectedTimeSlot === slot.timeSlot ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedTimeSlot(slot.timeSlot);
                          setMoveStartTime('');
                          setMoveEndTime('');
                        }
                      }}
                      disabled={isDisabled}
                    >
                      <span className="slot-icon">{getTimeSlotIcon(slot.timeSlot)}</span>
                      <span className="slot-name">{slot.timeSlot}</span>
                      <span className={`slot-status ${isDisabled ? 'unavailable' : 'available'}`}>
                        {slot.occupied ? 'Occupied' : slot.isCurrent ? 'Current' : slot.isPast ? 'Past' : 'Available'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Start Time */}
          {selectedMoveDate && selectedTimeSlot && (
            <div className="time-input-group">
              <label>🕐 Start Time:</label>
              <input 
                type="time"
                value={moveStartTime}
                onChange={(e) => setMoveStartTime(e.target.value)}
              />
            </div>
          )}

          {/* End Time */}
          {selectedMoveDate && selectedTimeSlot && moveStartTime && (
            <div className="time-input-group">
              <label>🕐 End Time:</label>
              <input 
                type="time"
                value={moveEndTime}
                onChange={(e) => setMoveEndTime(e.target.value)}
                min={moveStartTime}
              />
            </div>
          )}

          {/* Move Button */}
          {selectedMoveDate && selectedTimeSlot && moveStartTime && moveEndTime && (
            <button 
              className="move-slot-btn"
              onClick={handleMoveClick}
            >
              🔄 Move to Selected Slot
            </button>
          )}
        </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          {canMoveSession() && (
            <>
              <button className="cancel-slot-btn" onClick={handleCancel}>
                Mark as Missed
              </button>
              <button className="delete-slot-btn" onClick={handleDelete}>
                Delete This Slot
              </button>
            </>
          )}
        </div>
      </main>

      <BottomNav />

      {/* Confirm Action Modal */}
      {showConfirmModal && confirmAction && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{confirmAction.title}</h3>
              <button className="modal-close" onClick={() => setShowConfirmModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-icon">{confirmAction.type === 'delete' ? '🗑️' : '⚠️'}</div>
              <p className="confirm-message">{confirmAction.message}</p>
            </div>
            <div className="modal-footer">
              <button className="modal-btn modal-cancel" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
              <button 
                className={`modal-btn modal-confirm ${confirmAction.type === 'delete' ? 'danger' : 'warning'}`}
                onClick={() => {
                  confirmAction.action();
                  setShowConfirmModal(false);
                }}
              >
                {confirmAction.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move Confirmation Modal */}
      {showMoveModal && moveModalData && (
        <div className="modal-overlay" onClick={() => setShowMoveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Move</h3>
              <button className="modal-close" onClick={() => setShowMoveModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-icon">📅</div>
              <p className="modal-subject">Môn: <strong>{moveModalData.subjectName}</strong></p>
              <div className="modal-move-info">
                <div className="modal-from">
                  <span className="modal-label">Từ:</span>
                  <span className="modal-date">{moveModalData.oldDate}</span>
                  <span className="modal-time">{moveModalData.oldTimeSlot}</span>
                  <span className="modal-specific-time">{moveModalData.oldStartTime} - {moveModalData.oldEndTime}</span>
                </div>
                <div className="modal-arrow">→</div>
                <div className="modal-to">
                  <span className="modal-label">Sang:</span>
                  <span className="modal-date">{moveModalData.newDate}</span>
                  <span className="modal-time">{moveModalData.newTimeSlot}</span>
                  <span className="modal-specific-time">{moveModalData.newStartTime} - {moveModalData.newEndTime}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn modal-cancel" onClick={() => setShowMoveModal(false)}>
                Cancel
              </button>
              <button className="modal-btn modal-confirm" onClick={confirmMove}>
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SlotDetail;
