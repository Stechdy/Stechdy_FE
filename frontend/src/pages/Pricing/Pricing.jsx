import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";
import "./Pricing.css";

// SVG Icons
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

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SparkleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" />
    <path d="M19 5l.5 1.5L21 7l-1.5.5L19 9l-.5-1.5L17 7l1.5-.5L19 5z" />
  </svg>
);

const RocketIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const CrownIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
  </svg>
);

const ZapIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
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

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { resolvedTheme, setThemeMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setThemeMode(resolvedTheme === "dark" ? "light" : "dark");
  };

  const plans = [
    {
      id: "free",
      name: t("pricing.plans.free.name"),
      price: { monthly: 0, yearly: 0 },
      currency: "VND",
      description: t("pricing.plans.free.description"),
      features: [
        t("pricing.plans.free.features.basicScheduling"),
        t("pricing.plans.free.features.moodTracking"),
        t("pricing.plans.free.features.limitedAnalytics"),
        t("pricing.plans.free.features.basicGoals"),
      ],
      icon: <SparkleIcon />,
      buttonText: t("pricing.plans.free.buttonText"),
      buttonVariant: "secondary",
      isCurrent: true,
    },
    {
      id: "starter",
      name: t("pricing.plans.starter.name"),
      price: { monthly: 49000, yearly: 39000 },
      currency: "VND",
      description: t("pricing.plans.starter.description"),
      features: [
        t("pricing.plans.starter.features.everything"),
        t("pricing.plans.starter.features.advancedAnalytics"),
        t("pricing.plans.starter.features.customGoals"),
        t("pricing.plans.starter.features.exportData"),
        t("pricing.plans.starter.features.prioritySupport"),
      ],
      icon: <RocketIcon />,
      buttonText: t("pricing.plans.starter.buttonText"),
      buttonVariant: "primary",
      badge: t("pricing.plans.starter.badge"),
    },
    {
      id: "plus",
      name: t("pricing.plans.plus.name"),
      price: { monthly: 99000, yearly: 79000 },
      currency: "VND",
      description: t("pricing.plans.plus.description"),
      features: [
        t("pricing.plans.plus.features.everything"),
        t("pricing.plans.plus.features.aiInsights"),
        t("pricing.plans.plus.features.collaboration"),
        t("pricing.plans.plus.features.customThemes"),
        t("pricing.plans.plus.features.advancedMood"),
        t("pricing.plans.plus.features.integrations"),
      ],
      icon: <ZapIcon />,
      buttonText: t("pricing.plans.plus.buttonText"),
      buttonVariant: "primary",
      isPopular: true,
    },
    {
      id: "pro",
      name: t("pricing.plans.pro.name"),
      price: { monthly: 199000, yearly: 159000 },
      currency: "VND",
      description: t("pricing.plans.pro.description"),
      features: [
        t("pricing.plans.pro.features.everything"),
        t("pricing.plans.pro.features.aiCoach"),
        t("pricing.plans.pro.features.unlimitedStorage"),
        t("pricing.plans.pro.features.apiAccess"),
        t("pricing.plans.pro.features.dedicatedSupport"),
        t("pricing.plans.pro.features.earlyAccess"),
        t("pricing.plans.pro.features.customBranding"),
      ],
      icon: <CrownIcon />,
      buttonText: t("pricing.plans.pro.buttonText"),
      buttonVariant: "dark",
    },
  ];

  const formatPrice = (price) => {
    if (price === 0) return "0";
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleSelectPlan = (planId) => {
    if (planId === "free") {
      navigate("/register");
    } else {
      // Navigate to register with selected plan
      navigate(`/register?plan=${planId}&billing=${billingCycle}`);
    }
  };

  return (
    <div className="pricing-page">
      {/* Navbar */}
      <nav className="pricing-navbar">
        <Link to="/" className="pricing-logo">
          <div className="pricing-logo-icon">
            <BookIcon />
          </div>
          <span className="pricing-logo-text">S'Techdy</span>
        </Link>

        <div className="pricing-nav-actions">
          <LanguageSwitcher />
          <button
            className="pricing-theme-toggle"
            onClick={toggleTheme}
            aria-label={
              resolvedTheme === "dark"
                ? t("theme.switchToLight")
                : t("theme.switchToDark")
            }
          >
            {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link to="/login" className="pricing-btn pricing-btn-secondary">
            {t("nav.signIn")}
          </Link>
          <Link to="/register" className="pricing-btn pricing-btn-primary">
            {t("nav.getStarted")}
          </Link>
        </div>

        <button
          className="pricing-back-btn"
          onClick={() => navigate("/")}
          aria-label="Go back"
        >
          <ArrowLeftIcon />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="pricing-hero-content">
          <span className="pricing-badge">{t("pricing.badge")}</span>
          <h1 className="pricing-title">{t("pricing.title")}</h1>
          <p className="pricing-subtitle">{t("pricing.subtitle")}</p>

          {/* Billing Toggle */}
          <div className="pricing-toggle-container">
            <button
              className={`pricing-toggle-btn ${
                billingCycle === "monthly" ? "active" : ""
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              {t("pricing.monthly")}
            </button>
            <button
              className={`pricing-toggle-btn ${
                billingCycle === "yearly" ? "active" : ""
              }`}
              onClick={() => setBillingCycle("yearly")}
            >
              {t("pricing.yearly")}
              <span className="pricing-discount-badge">-20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-cards-section">
        <div className="pricing-cards-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${
                plan.isPopular ? "pricing-card-popular" : ""
              } ${plan.id === "pro" ? "pricing-card-dark" : ""}`}
            >
              {plan.isPopular && (
                <div className="pricing-popular-badge">
                  {t("pricing.mostPopular")}
                </div>
              )}
              {plan.badge && (
                <div className="pricing-new-badge">{plan.badge}</div>
              )}

              <div className="pricing-card-header">
                <div className="pricing-card-icon">{plan.icon}</div>
                <h3 className="pricing-card-name">{plan.name}</h3>
              </div>

              <div className="pricing-card-price">
                <span className="pricing-currency">₫</span>
                <span className="pricing-amount">
                  {formatPrice(plan.price[billingCycle])}
                </span>
                <span className="pricing-period">
                  {plan.price[billingCycle] === 0
                    ? ""
                    : `/${t("pricing.month")}`}
                </span>
              </div>

              <p className="pricing-card-description">{plan.description}</p>

              <button
                className={`pricing-card-btn pricing-card-btn-${plan.buttonVariant}`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.isCurrent ? t("pricing.currentPlan") : plan.buttonText}
              </button>

              <ul className="pricing-features-list">
                {plan.features.map((feature, index) => (
                  <li key={index} className="pricing-feature-item">
                    <span className="pricing-feature-check">
                      <CheckIcon />
                    </span>
                    <span className="pricing-feature-text">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pricing-faq-section">
        <h2 className="pricing-faq-title">{t("pricing.faq.title")}</h2>
        <div className="pricing-faq-grid">
          <div className="pricing-faq-item">
            <h4 className="pricing-faq-question">
              {t("pricing.faq.q1.question")}
            </h4>
            <p className="pricing-faq-answer">{t("pricing.faq.q1.answer")}</p>
          </div>
          <div className="pricing-faq-item">
            <h4 className="pricing-faq-question">
              {t("pricing.faq.q2.question")}
            </h4>
            <p className="pricing-faq-answer">{t("pricing.faq.q2.answer")}</p>
          </div>
          <div className="pricing-faq-item">
            <h4 className="pricing-faq-question">
              {t("pricing.faq.q3.question")}
            </h4>
            <p className="pricing-faq-answer">{t("pricing.faq.q3.answer")}</p>
          </div>
          <div className="pricing-faq-item">
            <h4 className="pricing-faq-question">
              {t("pricing.faq.q4.question")}
            </h4>
            <p className="pricing-faq-answer">{t("pricing.faq.q4.answer")}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pricing-footer">
        <div className="pricing-footer-content">
          <div className="pricing-footer-logo">
            <div className="pricing-footer-logo-icon">
              <BookIcon />
            </div>
            <span className="pricing-footer-logo-text">S'Techdy</span>
          </div>
          <p className="pricing-footer-text">
            {t("pricing.footer.helpText")}{" "}
            <a
              href="mailto:support@stechdy.com"
              className="pricing-footer-link"
            >
              support@stechdy.com
            </a>
          </p>
          <p className="pricing-footer-copyright">{t("footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
