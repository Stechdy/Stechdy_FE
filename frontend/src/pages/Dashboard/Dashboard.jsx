import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/common/BottomNav';
import { getVietnamTime, getVietnamDate } from '../../utils/helpers';
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
    const hour = getVietnamTime().getHours();
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

      // Fetch user data first
      const userResponse = await fetch('http://localhost:3001/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let currentUser = null;
      if (userResponse.ok) {
        currentUser = await userResponse.json();
        setUserData(currentUser);
        setStreak(currentUser.streakCount || 0);
        localStorage.setItem('user', JSON.stringify(currentUser));
      }

      // Get today's date range
      const today = getVietnamDate();
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      const todayEnd = new Date(today.setHours(23, 59, 59, 999));

      // Fetch today's study sessions for time tracking
      const sessionsResponse = await fetch(
        `http://localhost:3001/api/study-sessions/today?start=${todayStart.toISOString()}&end=${todayEnd.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      let todaySessions = [];
      let completedMinutes = 0;
      let goalMinutes = 360; // Default 6 hours

      if (sessionsResponse.ok) {
        todaySessions = await sessionsResponse.json();
        
        // Calculate completed study time from TODAY's sessions
        completedMinutes = todaySessions
          .filter(s => s.status === 'completed')
          .reduce((total, session) => {
            const duration = session.actualDuration || session.plannedDuration || 90;
            return total + duration;
          }, 0);

        // Calculate goal from all scheduled sessions today
        goalMinutes = todaySessions.reduce((total, session) => {
          return total + (session.plannedDuration || 90);
        }, 0) || 360;
      }

      // Fetch upcoming sessions by subject (current semester)
      const upcomingResponse = await fetch(
        'http://localhost:3001/api/study-sessions/upcoming-by-subject',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      let upcomingSessions = [];
      
      if (upcomingResponse.ok) {
        const upcomingData = await upcomingResponse.json();
        
        // Map to display format with full date and time
        upcomingSessions = upcomingData
          .slice(0, 3) // Show max 3 subjects
          .map(session => {
            const sessionDate = new Date(session.date);
            const dayOfWeek = sessionDate.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDay = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const year = sessionDate.getFullYear();
            
            return {
              id: session._id,
              subject: session.subjectInfo?.subjectName || 'Study Session',
              time: `${dayOfWeek}, ${monthDay} ${year} • ${session.startTime} - ${session.endTime}`,
              color: session.subjectInfo?.color || '#8AC0D5',
              topic: session.topic
            };
          });
      }

      // Generate AI suggestion based on progress
      let suggestion = 'Consider taking a 15-minute break';
      const progressPercent = (completedMinutes / goalMinutes) * 100;
      
      if (progressPercent >= 80) {
        suggestion = "Great progress today! You're almost done with your study goals 🎉";
      } else if (progressPercent >= 50) {
        suggestion = "You're halfway through! Keep up the good work 💪";
      } else if (upcomingSessions.length > 2) {
        suggestion = "You have multiple sessions today. Stay focused and take breaks! 🧘";
      } else if (completedMinutes >= 120) {
        suggestion = "You've been studying for 2+ hours. Time for a break! ☕";
      }

      const dashboardData = {
        studyProgress: { current: completedMinutes, goal: goalMinutes },
        streak: currentUser?.streakCount || 0,
        upcomingSessions: upcomingSessions.length > 0 ? upcomingSessions : [
          {
            id: 'placeholder1',
            subject: 'No upcoming sessions',
            time: 'Enjoy your free time!',
            color: '#8AC0D5'
          }
        ],
        aiSuggestion: suggestion
      };

      setStudyProgress(dashboardData.studyProgress);
      setUpcomingSessions(dashboardData.upcomingSessions);
      setAiSuggestion(dashboardData.aiSuggestion);
      
      // Cache dashboard data
      localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data on error
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const fallbackData = {
        studyProgress: { current: 0, goal: 360 },
        streak: 12,
        upcomingSessions: [
          {
            id: 'fallback1',
            subject: 'Backend Server Not Running',
            time: 'Please start the server to see your sessions',
            color: '#FF6B6B'
          }
        ],
        aiSuggestion: 'Unable to connect to server. Please check your backend connection.'
      };
      setStudyProgress(fallbackData.studyProgress);
      setUpcomingSessions(fallbackData.upcomingSessions);
      setAiSuggestion(fallbackData.aiSuggestion);
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
          <div className="progress-card" onClick={() => navigate('/study-tracker')} style={{ cursor: 'pointer' }}>
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
