import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moodService from "../../services/moodService";
import "./MoodCalendar.css";

const MoodCalendar = () => {
  const { t } = useTranslation();
  const [moods, setMoods] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const moodEmojis = {
    1: "😢",
    2: "😔",
    3: "😐",
    4: "😊",
    5: "😄",
  };

  const moodLabelKeys = {
    1: "moodCalendar.moods.upset",
    2: "moodCalendar.moods.sad",
    3: "moodCalendar.moods.normal",
    4: "moodCalendar.moods.happy",
    5: "moodCalendar.moods.veryHappy",
  };

  useEffect(() => {
    loadMonthMoods();
  }, [currentMonth]);

  const loadMonthMoods = async () => {
    setLoading(true);
    try {
      const startOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      );

      const response = await moodService.getMoodEntries({
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString(),
        limit: 100,
      });

      if (response.success) {
        setMoods(response.data);
      }
    } catch (error) {
      console.error("Error loading moods:", error);
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

    return moods.find((mood) => {
      // Parse mood date from backend (which is stored in Vietnam timezone)
      const moodDate = new Date(mood.date);

      // Get date components in UTC+7 (Vietnam timezone)
      const vietnamOffset = 7 * 60; // minutes
      const localTime = new Date(moodDate.getTime());

      // Compare with target date
      return (
        localTime.getFullYear() === currentMonth.getFullYear() &&
        localTime.getMonth() === currentMonth.getMonth() &&
        localTime.getDate() === day
      );
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
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const closeModal = () => {
    setSelectedDate(null);
    setSelectedMood(null);
  };

  const monthNameKeys = [
    "moodCalendar.months.january",
    "moodCalendar.months.february",
    "moodCalendar.months.march",
    "moodCalendar.months.april",
    "moodCalendar.months.may",
    "moodCalendar.months.june",
    "moodCalendar.months.july",
    "moodCalendar.months.august",
    "moodCalendar.months.september",
    "moodCalendar.months.october",
    "moodCalendar.months.november",
    "moodCalendar.months.december",
  ];

  const weekDayKeys = [
    "moodCalendar.weekDays.sun",
    "moodCalendar.weekDays.mon",
    "moodCalendar.weekDays.tue",
    "moodCalendar.weekDays.wed",
    "moodCalendar.weekDays.thu",
    "moodCalendar.weekDays.fri",
    "moodCalendar.weekDays.sat",
  ];

  return (
    <div className="mood-calendar">
      {/* Calendar Header */}
      <div className="calendar-header">
        <button className="nav-btn" onClick={previousMonth}>
          ←
        </button>
        <h2 className="calendar-title">
          {t(monthNameKeys[currentMonth.getMonth()])}{" "}
          {currentMonth.getFullYear()}
        </h2>
        <button className="nav-btn" onClick={nextMonth}>
          →
        </button>
      </div>

      {/* Week Days */}
      <div className="calendar-weekdays">
        {weekDayKeys.map((dayKey, index) => (
          <div key={index} className="weekday">
            {t(dayKey)}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {getDaysInMonth().map((day, index) => {
          const mood = getMoodForDate(day);
          const isToday =
            day &&
            day === new Date().getDate() &&
            currentMonth.getMonth() === new Date().getMonth() &&
            currentMonth.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={index}
              className={`calendar-day ${!day ? "empty" : ""} ${
                isToday ? "today" : ""
              } ${mood ? "has-mood" : ""}`}
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
                {selectedDate} {t(monthNameKeys[currentMonth.getMonth()])}
              </h3>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="modal-mood">
                <span className="modal-emoji">
                  {moodEmojis[selectedMood.mood]}
                </span>
                <span className="modal-label">
                  {t(moodLabelKeys[selectedMood.mood])}
                </span>
              </div>

              {selectedMood.energyLevel && (
                <div className="modal-energy">
                  <span className="modal-field-label">
                    ⚡ {t("moodCalendar.energy")}
                  </span>
                  <span className="modal-field-value">
                    {selectedMood.energyLevel}/10
                  </span>
                </div>
              )}

              {selectedMood.emotionTags &&
                selectedMood.emotionTags.length > 0 && (
                  <div className="modal-emotions">
                    <span className="modal-field-label">
                      🏷️ {t("moodCalendar.emotions")}
                    </span>
                    <div className="modal-emotion-tags">
                      {selectedMood.emotionTags.map((tag, idx) => (
                        <span key={idx} className="modal-emotion-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {selectedMood.note && (
                <div className="modal-note">
                  <span className="modal-field-label">
                    📝 {t("moodCalendar.notes")}
                  </span>
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
