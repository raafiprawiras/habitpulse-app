/**
 * HabitPulse Application Main Entry Point
 */
import './style.css';
import { ThemeManager } from './js/theme.js';
import { DashboardController } from './js/dashboard.js';
import { LandingController } from './js/landing.js';
import { HistoryController } from './js/history.js';
import { AnalyticsController } from './js/analytics.js';
import { AchievementsController } from './js/achievements.js';
import { SettingsController } from './js/settings.js';
import { $$ } from './js/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Theme Engine
  ThemeManager.init();

  // Bind Theme Toggle Buttons
  const themeToggleBtns = $$('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ThemeManager.toggleTheme();
    });
  });

  // Initialize Landing Page Controller
  LandingController.init();

  // Initialize Dashboard Controller
  DashboardController.init();

  // Initialize Activity History Controller
  HistoryController.init();

  // Initialize Analytics Controller
  AnalyticsController.init();

  // Initialize Achievements & Weekly Goals Controller
  AchievementsController.init();

  // Initialize Settings Controller
  SettingsController.init();
});
