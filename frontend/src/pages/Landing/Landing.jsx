import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./Landing.css";

// SVG Icons as components for better maintainability
const BookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const SmileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TargetIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const StarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const MenuIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SunIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme, setThemeMode } = useTheme();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleTheme = () => {
    setThemeMode(resolvedTheme === "dark" ? "light" : "dark");
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const features = [
    {
      icon: <CalendarIcon />,
      title: "Smart Scheduling",
      description:
        "Plan your study sessions with an intelligent calendar that adapts to your learning patterns and goals.",
    },
    {
      icon: <SmileIcon />,
      title: "Mood Tracking",
      description:
        "Monitor your emotional wellbeing and discover how it affects your study performance over time.",
    },
    {
      icon: <TrendingUpIcon />,
      title: "Progress Analytics",
      description:
        "Track your learning journey with detailed insights and beautiful visualizations of your progress.",
    },
    {
      icon: <TargetIcon />,
      title: "Goal Setting",
      description:
        "Set achievable study goals and celebrate milestones as you work towards academic success.",
    },
    {
      icon: <ClockIcon />,
      title: "Time Management",
      description:
        "Master your time with study trackers and reminders that keep you focused and on schedule.",
    },
    {
      icon: <BookIcon />,
      title: "Study Sessions",
      description:
        "Organize your subjects and track dedicated study time for each course or topic.",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Create Your Account",
      description:
        "Sign up in seconds and set up your personalized study profile with your goals.",
    },
    {
      number: 2,
      title: "Plan Your Schedule",
      description:
        "Add your subjects, set study times, and let S'Techdy help you build the perfect routine.",
    },
    {
      number: 3,
      title: "Track & Improve",
      description:
        "Monitor your progress, check in on your mood, and watch your productivity soar.",
    },
  ];

  const testimonials = [
    {
      text: '"S\'Techdy completely transformed how I approach studying. The mood tracking feature helped me understand my best study times."',
      name: "Sarah Chen",
      role: "Medical Student",
      avatar: "SC",
    },
    {
      text: '"Finally, an app that understands that studying is not just about time, but about mental wellness too. Highly recommend!"',
      name: "James Wilson",
      role: "Engineering Major",
      avatar: "JW",
    },
    {
      text: '"The progress analytics are incredible. I can actually see how much Ive improved over the semester. Game changer!"',
      name: "Emily Rodriguez",
      role: "Law Student",
      avatar: "ER",
    },
  ];

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar">
        <Link to="/" className="landing-logo">
          <div className="landing-logo-icon">
            <BookIcon />
          </div>
          <span className="landing-logo-text">S'Techdy</span>
        </Link>

        <div className="landing-nav-links">
          <span
            className="landing-nav-link"
            onClick={() => scrollToSection("features")}
          >
            Features
          </span>
          <span
            className="landing-nav-link"
            onClick={() => scrollToSection("how-it-works")}
          >
            How It Works
          </span>
          <span
            className="landing-nav-link"
            onClick={() => scrollToSection("testimonials")}
          >
            Testimonials
          </span>
        </div>

        <div className="landing-nav-actions">
          <button
            className="landing-theme-toggle"
            onClick={toggleTheme}
            aria-label={
              resolvedTheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link to="/login" className="landing-btn landing-btn-secondary">
            Sign In
          </Link>
          <Link to="/register" className="landing-btn landing-btn-primary">
            Get Started
          </Link>
        </div>

        <button
          className="landing-menu-btn"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`landing-mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <span
          className="landing-mobile-menu-link"
          onClick={() => scrollToSection("features")}
        >
          Features
        </span>
        <span
          className="landing-mobile-menu-link"
          onClick={() => scrollToSection("how-it-works")}
        >
          How It Works
        </span>
        <span
          className="landing-mobile-menu-link"
          onClick={() => scrollToSection("testimonials")}
        >
          Testimonials
        </span>
        <button className="landing-mobile-theme-toggle" onClick={toggleTheme}>
          {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
          <span>{resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <div className="landing-mobile-menu-actions">
          <Link
            to="/login"
            className="landing-btn landing-btn-secondary"
            style={{ width: "100%" }}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="landing-btn landing-btn-primary"
            style={{ width: "100%" }}
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <span className="landing-hero-badge-dot" />
            <span>Your study companion is here</span>
          </div>

          <h1 className="landing-hero-title">
            Study Smarter,
            <br />
            <span className="landing-hero-title-gradient">Feel Better</span>
          </h1>

          <p className="landing-hero-subtitle">
            S'Techdy combines intelligent study planning with mood tracking to
            help you achieve academic success while maintaining your mental
            wellness.
          </p>

          <div className="landing-hero-actions">
            <Link
              to="/register"
              className="landing-btn landing-btn-primary landing-btn-large"
            >
              Start Free Trial
              <ArrowRightIcon />
            </Link>
            <Link
              to="/login"
              className="landing-btn landing-btn-secondary landing-btn-large"
            >
              Sign In
            </Link>
          </div>

          <div className="landing-hero-stats">
            <div className="landing-hero-stat">
              <div className="landing-hero-stat-value">10K+</div>
              <div className="landing-hero-stat-label">Active Students</div>
            </div>
            <div className="landing-hero-stat">
              <div className="landing-hero-stat-value">95%</div>
              <div className="landing-hero-stat-label">Improved Focus</div>
            </div>
            <div className="landing-hero-stat">
              <div className="landing-hero-stat-value">4.9</div>
              <div className="landing-hero-stat-label">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features">
        <div className="landing-section-header">
          <span className="landing-section-badge">Features</span>
          <h2 className="landing-section-title">
            Everything You Need to Excel
          </h2>
          <p className="landing-section-subtitle">
            Powerful tools designed to optimize your study routine and support
            your wellbeing.
          </p>
        </div>

        <div className="landing-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="landing-feature-card">
              <div className="landing-feature-icon">{feature.icon}</div>
              <h3 className="landing-feature-title">{feature.title}</h3>
              <p className="landing-feature-description">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="landing-how-it-works">
        <div className="landing-section-header">
          <span className="landing-section-badge">How It Works</span>
          <h2 className="landing-section-title">
            Get Started in 3 Simple Steps
          </h2>
          <p className="landing-section-subtitle">
            Begin your journey to better studying in just minutes.
          </p>
        </div>

        <div className="landing-steps">
          {steps.map((step, index) => (
            <div key={index} className="landing-step">
              <div className="landing-step-number">{step.number}</div>
              <h3 className="landing-step-title">{step.title}</h3>
              <p className="landing-step-description">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="landing-step-connector" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="landing-testimonials">
        <div className="landing-section-header">
          <span className="landing-section-badge">Testimonials</span>
          <h2 className="landing-section-title">Loved by Students Worldwide</h2>
          <p className="landing-section-subtitle">
            See what our community has to say about their S'Techdy experience.
          </p>
        </div>

        <div className="landing-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="landing-testimonial-card">
              <div className="landing-testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className="landing-testimonial-text">{testimonial.text}</p>
              <div className="landing-testimonial-author">
                <div className="landing-testimonial-avatar">
                  {testimonial.avatar}
                </div>
                <div className="landing-testimonial-info">
                  <p className="landing-testimonial-name">{testimonial.name}</p>
                  <p className="landing-testimonial-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="landing-cta-card">
          <div className="landing-cta-content">
            <h2 className="landing-cta-title">
              Ready to Transform Your Studies?
            </h2>
            <p className="landing-cta-subtitle">
              Join thousands of students who are already studying smarter with
              S'Techdy.
            </p>
            <Link to="/register" className="landing-cta-btn">
              Get Started Free
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-content">
          <div className="landing-footer-logo">
            <div className="landing-footer-logo-icon">
              <BookIcon />
            </div>
            <span className="landing-footer-logo-text">S'Techdy</span>
          </div>

          <div className="landing-footer-links">
            <span
              className="landing-footer-link"
              onClick={() => scrollToSection("features")}
            >
              Features
            </span>
            <span
              className="landing-footer-link"
              onClick={() => scrollToSection("how-it-works")}
            >
              How It Works
            </span>
            <span
              className="landing-footer-link"
              onClick={() => scrollToSection("testimonials")}
            >
              Testimonials
            </span>
            <Link to="/login" className="landing-footer-link">
              Sign In
            </Link>
          </div>

          <p className="landing-footer-copyright">
            © 2025 S'Techdy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
