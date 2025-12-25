import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import notificationService from '../../services/notificationService';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifs, setFilteredNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // all, unread, read
  const [activeType, setActiveType] = useState('all'); // all, mood, study, task, etc.
  const [selectedNotifs, setSelectedNotifs] = useState([]);
  const [selectMode, setSelectMode] = useState(false);

  const { 
    isConnected,
    notifications: socketNotifications,
    unreadCount 
  } = useSocket();

  useEffect(() => {
    loadNotifications();
  }, []);

  // Sync with socket
  useEffect(() => {
    if (isConnected && socketNotifications) {
      setNotifications(socketNotifications);
    }
  }, [socketNotifications, isConnected]);

  // Apply filters
  useEffect(() => {
    let filtered = [...notifications];

    // Filter by read status
    if (activeFilter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (activeFilter === 'read') {
      filtered = filtered.filter(n => n.read);
    }

    // Filter by type
    if (activeType !== 'all') {
      filtered = filtered.filter(n => n.type.includes(activeType));
    }

    setFilteredNotifs(filtered);
  }, [notifications, activeFilter, activeType]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      setSelectedNotifs(prev => prev.filter(nId => nId !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedNotifs.map(id => notificationService.deleteNotification(id))
      );
      setNotifications(prev => 
        prev.filter(n => !selectedNotifs.includes(n._id))
      );
      setSelectedNotifs([]);
      setSelectMode(false);
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
  };

  const handleSelectNotif = (id) => {
    if (selectedNotifs.includes(id)) {
      setSelectedNotifs(prev => prev.filter(nId => nId !== id));
    } else {
      setSelectedNotifs(prev => [...prev, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifs.length === filteredNotifs.length) {
      setSelectedNotifs([]);
    } else {
      setSelectedNotifs(filteredNotifs.map(n => n._id));
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      mood_checkin: '😊',
      mood_reminder: '💭',
      study_reminder: '📚',
      task_reminder: '✅',
      achievement: '🏆',
      level_up: '⭐',
      streak_milestone: '🔥',
      subscription: '💎',
      payment: '💳',
      admin_message: '👨‍💼',
      announcement: '📢',
      system: '🔔'
    };
    return icons[type] || '🔔';
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInMinutes = Math.floor((now - notifDate) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return notifDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const typeLabels = {
    all: 'All',
    mood: 'Mood Tracking',
    study: 'Study',
    task: 'Task',
    achievement: 'Achievement',
    system: 'System'
  };

  return (
    <div className="notifications-page">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <h1>Notifications</h1>
            <span className="connection-status">
              {isConnected ? (
                <>
                  <span className="status-dot online"></span>
                  Connected
                </>
              ) : (
                <>
                  <span className="status-dot offline"></span>
                  Offline
                </>
              )}
            </span>
          </div>

          <div className="header-actions">
            {selectMode ? (
              <>
                <button 
                  className="action-btn secondary"
                  onClick={() => {
                    setSelectMode(false);
                    setSelectedNotifs([]);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="action-btn danger"
                  onClick={handleDeleteSelected}
                  disabled={selectedNotifs.length === 0}
                >
                  Delete ({selectedNotifs.length})
                </button>
              </>
            ) : (
              <>
                {unreadCount > 0 && (
                  <button 
                    className="action-btn primary"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
                <button 
                  className="action-btn secondary"
                  onClick={() => setSelectMode(true)}
                >
                  Select
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Status:</label>
            <div className="filter-buttons">
              {['all', 'unread', 'read'].map(filter => (
                <button
                  key={filter}
                  className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter === 'all' && `All (${notifications.length})`}
                  {filter === 'unread' && `Unread (${unreadCount})`}
                  {filter === 'read' && `Read (${notifications.length - unreadCount})`}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Type:</label>
            <div className="filter-buttons">
              {Object.entries(typeLabels).map(([key, label]) => (
                <button
                  key={key}
                  className={`filter-btn ${activeType === key ? 'active' : ''}`}
                  onClick={() => setActiveType(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Select All */}
        {selectMode && filteredNotifs.length > 0 && (
          <div className="select-all-bar">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedNotifs.length === filteredNotifs.length}
                onChange={handleSelectAll}
              />
              Select all ({filteredNotifs.length})
            </label>
          </div>
        )}

        {/* Notifications List */}
        <div className="notifications-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifs.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">
                {activeFilter === 'unread' ? '✅' : '🔔'}
              </span>
              <h3>
                {activeFilter === 'unread' 
                  ? 'All caught up!'
                  : 'No notifications yet'}
              </h3>
              <p>
                {activeFilter === 'unread'
                  ? 'All notifications have been read'
                  : 'New notifications will appear here'}
              </p>
            </div>
          ) : (
            <div className="notifications-grid">
              {filteredNotifs.map(notif => (
                <div
                  key={notif._id}
                  className={`notification-card ${!notif.read ? 'unread' : ''} ${
                    selectedNotifs.includes(notif._id) ? 'selected' : ''
                  }`}
                  onClick={() => {
                    if (selectMode) {
                      handleSelectNotif(notif._id);
                    } else if (!notif.read) {
                      handleMarkAsRead(notif._id);
                    }
                  }}
                >
                  {selectMode && (
                    <div className="select-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedNotifs.includes(notif._id)}
                        onChange={() => handleSelectNotif(notif._id)}
                      />
                    </div>
                  )}

                  <div className="card-icon">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="card-content">
                    <div className="card-header">
                      <h3>{notif.title}</h3>
                      {!notif.read && <span className="unread-badge">New</span>}
                    </div>
                    <p className="card-message">{notif.message}</p>
                    <div className="card-footer">
                      <span className="card-time">{formatTime(notif.createdAt)}</span>
                      <span className="card-type">{typeLabels[notif.type.split('_')[0]] || 'Other'}</span>
                    </div>
                  </div>

                  {!selectMode && (
                    <button
                      className="card-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notif._id);
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
