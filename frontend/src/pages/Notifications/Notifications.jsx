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

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    return notifDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const typeLabels = {
    all: 'Tất cả',
    mood: 'Mood Tracking',
    study: 'Học tập',
    task: 'Task',
    achievement: 'Thành tích',
    system: 'Hệ thống'
  };

  return (
    <div className="notifications-page">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <h1>Thông báo</h1>
            <span className="connection-status">
              {isConnected ? (
                <>
                  <span className="status-dot online"></span>
                  Đang kết nối
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
                  Hủy
                </button>
                <button 
                  className="action-btn danger"
                  onClick={handleDeleteSelected}
                  disabled={selectedNotifs.length === 0}
                >
                  Xóa ({selectedNotifs.length})
                </button>
              </>
            ) : (
              <>
                {unreadCount > 0 && (
                  <button 
                    className="action-btn primary"
                    onClick={handleMarkAllAsRead}
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
                <button 
                  className="action-btn secondary"
                  onClick={() => setSelectMode(true)}
                >
                  Chọn
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Trạng thái:</label>
            <div className="filter-buttons">
              {['all', 'unread', 'read'].map(filter => (
                <button
                  key={filter}
                  className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter === 'all' && `Tất cả (${notifications.length})`}
                  {filter === 'unread' && `Chưa đọc (${unreadCount})`}
                  {filter === 'read' && `Đã đọc (${notifications.length - unreadCount})`}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Loại:</label>
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
              Chọn tất cả ({filteredNotifs.length})
            </label>
          </div>
        )}

        {/* Notifications List */}
        <div className="notifications-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Đang tải thông báo...</p>
            </div>
          ) : filteredNotifs.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">
                {activeFilter === 'unread' ? '✅' : '🔔'}
              </span>
              <h3>
                {activeFilter === 'unread' 
                  ? 'Bạn đã đọc hết thông báo!'
                  : 'Chưa có thông báo nào'}
              </h3>
              <p>
                {activeFilter === 'unread'
                  ? 'Tất cả thông báo đã được đọc'
                  : 'Thông báo mới sẽ xuất hiện ở đây'}
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
                      {!notif.read && <span className="unread-badge">Mới</span>}
                    </div>
                    <p className="card-message">{notif.message}</p>
                    <div className="card-footer">
                      <span className="card-time">{formatTime(notif.createdAt)}</span>
                      <span className="card-type">{typeLabels[notif.type.split('_')[0]] || 'Khác'}</span>
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
