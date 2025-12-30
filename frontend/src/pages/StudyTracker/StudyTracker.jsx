import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BottomNav from "../../components/common/BottomNav";
import SidebarNav from "../../components/common/SidebarNav";
import { getVietnamTime, getVietnamDate } from "../../utils/helpers";
import "./StudyTracker.css";

const StudyTracker = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = last week, +1 = next week
  const [currentWeekNumber, setCurrentWeekNumber] = useState(null);
  const [weekSchedule, setWeekSchedule] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [todayProgress, setTodayProgress] = useState([]);
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalActiveDays: 0,
    totalHours: 0,
    calendar: [],
    streakHistory: [],
    lastActiveDate: null,
  });

  useEffect(() => {
    fetchStudyTrackerData();
  }, [weekOffset]);

  const fetchStudyTrackerData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Fetch subjects
      const subjectsResponse = await fetch(
        "http://localhost:3001/api/subjects",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (subjectsResponse.ok) {
        const subjectsData = await subjectsResponse.json();
        setSubjects(subjectsData);
      }

      // Fetch week schedule
      const scheduleResponse = await fetch(
        `http://localhost:3001/api/study-sessions/week?offset=${weekOffset}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (scheduleResponse.ok) {
        const scheduleData = await scheduleResponse.json();
        setWeekSchedule(scheduleData.sessions || []);
        setCurrentWeekNumber(scheduleData.weekNumber);
      }

      // Fetch today's progress
      const today = getVietnamDate();
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      const todayEnd = new Date(today.setHours(23, 59, 59, 999));

      const progressResponse = await fetch(
        `http://localhost:3001/api/study-sessions/today?start=${todayStart.toISOString()}&end=${todayEnd.toISOString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (progressResponse.ok) {
        const sessions = await progressResponse.json();
        const progressBySubject = calculateProgressBySubject(sessions);
        setTodayProgress(progressBySubject);
      }

      // Fetch streak data
      const streakResponse = await fetch(
        "http://localhost:3001/api/users/streak",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (streakResponse.ok) {
        const streak = await streakResponse.json();
        setStreakData(streak);
      }
    } catch (error) {
      console.error("Error fetching study tracker data:", error);
    }
  };

  const calculateProgressBySubject = (sessions) => {
    // Calculate total progress for today instead of by subject
    let totalCompleted = 0;
    let totalGoal = 0;

    sessions.forEach((session) => {
      const plannedDuration = session.plannedDuration || 90;
      totalGoal += plannedDuration;

      if (session.status === "completed") {
        // Sum up actual duration of all completed sessions
        const actualDuration = session.actualDuration || plannedDuration;
        totalCompleted += actualDuration;
      }
    });

    // Cap total completed at total goal to avoid showing more than 100%
    totalCompleted = Math.min(totalCompleted, totalGoal);

    // Return single item for total progress
    if (totalGoal === 0) return [];

    return [
      {
        subjectKey: "studyTracker.totalStudyTime",
        completed: totalCompleted,
        goal: totalGoal,
        color: "#8AC0D5",
      },
    ];
  };

  const getWeekDates = () => {
    const dates = [];
    const today = getVietnamDate();
    const currentDay = today.getDay();

    // Get current Monday
    const currentMonday = new Date(today);
    const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    currentMonday.setDate(today.getDate() + daysToMonday);

    // Apply weekOffset to get the Monday of requested week
    const weekMonday = new Date(currentMonday);
    weekMonday.setDate(currentMonday.getDate() + weekOffset * 7);

    // Generate 7 days from Monday to Sunday
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekMonday);
      date.setDate(weekMonday.getDate() + i);
      dates.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        fullDate: date, // Keep full date object for comparison
      });
    }

    return dates;
  };

  const getSessionStatus = (day, timeSlot) => {
    const session = weekSchedule.find(
      (s) => s.dayOfWeek === day && s.timeSlot === timeSlot
    );

    if (!session) return "no-slot";

    // Check if session is in the future by comparing date + end time
    const sessionDate = new Date(session.date);
    const [endHour, endMinute] = (session.endTime || "23:59")
      .split(":")
      .map(Number);
    sessionDate.setHours(endHour, endMinute, 0, 0);

    const now = getVietnamTime();

    // Future sessions or sessions that haven't ended yet = scheduled
    if (sessionDate > now) {
      return "scheduled";
    }

    // Past sessions - check actual status
    if (session.status === "completed") return "present";
    if (session.status === "cancelled" || session.status === "missed")
      return "absent";

    // Past but not marked = absent (missed)
    return "absent";
  };

  const getSessionColor = (day, timeSlot) => {
    const session = weekSchedule.find(
      (s) => s.dayOfWeek === day && s.timeSlot === timeSlot
    );
    return session?.subjectInfo?.color || "#8AC0D5";
  };

  const renderStatusIcon = (status, color) => {
    if (status === "no-slot") {
      return <div className="status-icon no-slot">−</div>;
    }
    if (status === "absent") {
      return (
        <div className="status-icon absent" style={{ backgroundColor: color }}>
          ×
        </div>
      );
    }
    if (status === "scheduled") {
      return (
        <div
          className="status-icon scheduled"
          style={{ backgroundColor: color }}
        >
          −
        </div>
      );
    }
    return (
      <div className="status-icon present" style={{ backgroundColor: color }}>
        ✓
      </div>
    );
  };

  const weekDates = getWeekDates();
  const timeSlotKeys = [
    "studyTracker.timeSlots.morning",
    "studyTracker.timeSlots.afternoon",
    "studyTracker.timeSlots.evening",
  ];
  const timeSlots = ["Mor", "Aft", "Eve"];

  return (
    <div className="study-tracker-container">
      <SidebarNav />
      <div className="study-tracker">
        <header className="tracker-header">
          <h1 className="tracker-page-title">{t("studyTracker.title")}</h1>
          <button className="notification-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"
                fill="#E85D75"
              />
            </svg>
            <span className="notification-badge"></span>
          </button>
        </header>

        {/* Main Content */}
        <main className="tracker-main">
          {/* Weekly Schedule */}
          <section className="weekly-schedule">
            <div className="schedule-header">
              <h2>{t("studyTracker.weeklySchedule")}</h2>
              <div className="week-navigation">
                <button onClick={() => setWeekOffset(weekOffset - 1)}>‹</button>
                <span>
                  {t("studyTracker.week")} {currentWeekNumber || "..."}
                </span>
                <button onClick={() => setWeekOffset(weekOffset + 1)}>›</button>
              </div>
            </div>

            <div className="schedule-grid">
              <div className="schedule-row header-row">
                <div className="time-slot-label"></div>
                {weekDates.map((day, idx) => {
                  const today = getVietnamDate();
                  today.setHours(0, 0, 0, 0);
                  const dayDate = new Date(day.fullDate);
                  dayDate.setHours(0, 0, 0, 0);
                  const isToday = dayDate.getTime() === today.getTime();

                  return (
                    <div
                      key={idx}
                      className={`day-header ${isToday ? "today" : ""}`}
                    >
                      <div className="day-name">{day.day}</div>
                      <div className="day-date">{day.date}</div>
                    </div>
                  );
                })}
              </div>

              {timeSlots.map((slot, slotIdx) => (
                <div key={slotIdx} className="schedule-row">
                  <div className="time-slot-label">
                    {t(timeSlotKeys[slotIdx])}
                  </div>
                  {weekDates.map((day, dayIdx) => {
                    const status = getSessionStatus(day.day, slot);
                    const color = getSessionColor(day.day, slot);
                    return (
                      <div key={dayIdx} className="schedule-cell">
                        {renderStatusIcon(status, color)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="schedule-legend">
              <div className="legend-item">
                <div className="legend-icon present">✓</div>
                <span>{t("studyTracker.present")}</span>
              </div>
              <div className="legend-item">
                <div className="legend-icon absent">×</div>
                <span>{t("studyTracker.absent")}</span>
              </div>
              <div className="legend-item">
                <div className="legend-icon no-slot">−</div>
                <span>{t("studyTracker.noSlot")}</span>
              </div>
            </div>
          </section>

          {/* Subject Legend */}
          <section className="subject-legend">
            <h3>{t("studyTracker.subjectLegend")}</h3>
            <div className="subjects-grid">
              {subjects.map((subject, idx) => (
                <div
                  key={idx}
                  className="subject-item"
                  onClick={() => navigate(`/subject/${subject._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="subject-color"
                    style={{ backgroundColor: subject.color }}
                  ></div>
                  <span>{subject.subjectName}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Today's Progress */}
          <section className="today-progress">
            <h3>{t("studyTracker.todaysProgress")}</h3>
            {todayProgress.map((item, idx) => (
              <div key={idx} className="progress-item">
                <div className="progress-header">
                  <div className="progress-label">
                    <div
                      className="progress-dot"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>
                      {item.subjectKey ? t(item.subjectKey) : item.subject}
                    </span>
                  </div>
                  <span className="progress-time">
                    {Math.floor(item.completed / 60)}h {item.completed % 60}m /{" "}
                    {Math.floor(item.goal / 60)}h
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.min(
                        (item.completed / item.goal) * 100,
                        100
                      )}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </section>

          {/* Study Streak Calendar */}
          <section className="streak-calendar">
            <h3>{t("studyTracker.streakCalendar")}</h3>
            <div>
              <div className="calendar-header">
                {[
                  t("studyTracker.weekDays.mon"),
                  t("studyTracker.weekDays.tue"),
                  t("studyTracker.weekDays.wed"),
                  t("studyTracker.weekDays.thu"),
                  t("studyTracker.weekDays.fri"),
                  t("studyTracker.weekDays.sat"),
                  t("studyTracker.weekDays.sun"),
                ].map((day, idx) => (
                  <div key={idx} className="weekday">
                    {day}
                  </div>
                ))}
              </div>
              <div className="calendar-grid">
                {Array.from({ length: 35 }, (_, i) => {
                  const currentDate = getVietnamDate();
                  const today = currentDate.getDate();
                  const firstDay = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    1
                  );
                  const startDay = firstDay.getDay();
                  const daysInMonth = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    0
                  ).getDate();

                  const mondayShift = startDay === 0 ? 6 : startDay - 1;
                  const dayNumber = i - mondayShift + 1;
                  const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
                  const isActive =
                    isValidDay && streakData.calendar?.includes(dayNumber);
                  const isToday = isValidDay && dayNumber === today;

                  return (
                    <div
                      key={i}
                      className={`calendar-day ${isToday ? "today" : ""} ${
                        isActive ? "active" : ""
                      } ${!isValidDay ? "empty" : ""}`}
                    >
                      {isValidDay ? dayNumber : ""}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Streak Stats */}
            <div className="streak-stats">
              <div className="streak-stat-item">
                <span className="streak-icon">🔥</span>
                <div className="streak-stat-info">
                  <span className="streak-stat-value">
                    {streakData.currentStreak || 0}
                  </span>
                  <span className="streak-stat-label">
                    {t("studyTracker.currentStreak")}
                  </span>
                </div>
              </div>
              <div className="streak-stat-item">
                <span className="streak-icon">🏆</span>
                <div className="streak-stat-info">
                  <span className="streak-stat-value">
                    {streakData.longestStreak || 0}
                  </span>
                  <span className="streak-stat-label">
                    {t("studyTracker.longestStreak")}
                  </span>
                </div>
              </div>
              <div className="streak-stat-item">
                <span className="streak-icon">📅</span>
                <div className="streak-stat-info">
                  <span className="streak-stat-value">
                    {streakData.totalActiveDays || 0}
                  </span>
                  <span className="streak-stat-label">
                    {t("studyTracker.totalDays")}
                  </span>
                </div>
              </div>
              <div className="streak-stat-item">
                <span className="streak-icon">⏱️</span>
                <div className="streak-stat-info">
                  <span className="streak-stat-value">
                    {streakData.totalHours || 0}h
                  </span>
                  <span className="streak-stat-label">
                    {t("studyTracker.studyHours")}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default StudyTracker;
