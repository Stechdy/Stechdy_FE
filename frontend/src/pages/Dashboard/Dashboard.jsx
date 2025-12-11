import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [studyProgress, setStudyProgress] = useState({ current: 0, goal: 360 });
  const [streak, setStreak] = useState(12);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [greeting, setGreeting] = useState('Good morning!');

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 18) return 'Good afternoon!';
    return 'Good evening!';
  };

  useEffect(() => {
    setGreeting(getGreeting());
    loadCachedData();
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load cached data immediately for instant display
  const loadCachedData = () => {
    const storedUser = localStorage.getItem('user');
    const cachedDashboard = localStorage.getItem('dashboardData');
    
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    
    if (cachedDashboard) {
      const data = JSON.parse(cachedDashboard);
      setStudyProgress(data.studyProgress || { current: 0, goal: 360 });
      setStreak(data.streak || 0);
      setUpcomingSessions(data.upcomingSessions || []);
      setAiSuggestion(data.aiSuggestion || '');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch user data in background
      const userResponse = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (userResponse.ok) {
        const user = await userResponse.json();
        setUserData(user);
        localStorage.setItem('user', JSON.stringify(user));
      }

      // Mock data for now - replace with actual API calls
      const dashboardData = {
        studyProgress: { current: 270, goal: 360 },
        streak: 12,
        upcomingSessions: [
          {
            id: 1,
            subject: 'Mathematics',
            time: '2:00 PM - 3:30 PM',
            color: '#8AC0D5'
          },
          {
            id: 2,
            subject: 'Physics Review',
            time: '4:00 PM - 5:00 PM',
            color: '#F0C5D5'
          }
        ],
        aiSuggestion: 'Consider taking a 15-minute break'
      };

      setStudyProgress(dashboardData.studyProgress);
      setStreak(dashboardData.streak);
      setUpcomingSessions(dashboardData.upcomingSessions);
      setAiSuggestion(dashboardData.aiSuggestion);
      
      // Cache dashboard data
      localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const progressPercentage = (studyProgress.current / studyProgress.goal) * 100;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <img 
            src={userData?.avatarUrl || 'https://i.pravatar.cc/150?img=1'} 
            alt="Profile" 
            className="profile-avatar"
          />
          <div className="header-text">
            <h1 className="greeting">{greeting}</h1>
            <p className="username">{userData?.name || 'User'}</p>
          </div>
        </div>
        <button className="notification-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#1F1F1F"/>
          </svg>
          <span className="notification-badge"></span>
        </button>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Streak Card */}
        <div className="streak-card gradient-card">
          <div className="streak-content">
            <div className="streak-info">
              <p className="streak-label">Current Streak</p>
              <h2 className="streak-days">{streak} Days</h2>
            </div>
            <div className="streak-icon">🔥</div>
          </div>
          <button className="quotes-btn">Quotes</button>
        </div>

        {/* Today's Progress */}
        <section className="progress-section">
          <h2 className="section-title">Today's Progress</h2>
          <div className="progress-card">
            <div className="progress-header">
              <span className="progress-label">Study Time</span>
              <span className="progress-time">
                {Math.floor(studyProgress.current / 60)}h {studyProgress.current % 60}m / {Math.floor(studyProgress.goal / 60)}h
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* Upcoming Sessions */}
        <section className="sessions-section">
          <h2 className="section-title">Upcoming Sessions</h2>
          <div className="sessions-list">
            {upcomingSessions.map(session => (
              <div key={session.id} className="session-card">
                <div className="session-left">
                  <div 
                    className="session-indicator" 
                    style={{ backgroundColor: session.color }}
                  ></div>
                  <div className="session-info">
                    <h3 className="session-subject">{session.subject}</h3>
                    <p className="session-time">{session.time}</p>
                  </div>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ))}
          </div>
        </section>

        {/* AI Suggestion */}
        <section className="ai-section">
          <h2 className="section-title">AI Suggestion</h2>
          <div className="ai-card gradient-card">
            <div className="ai-icon">🤖</div>
            <p className="ai-text">{aiSuggestion}</p>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Dashboard;
