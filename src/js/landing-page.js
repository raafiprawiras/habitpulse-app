/**
 * HabitPulse Landing Page Controller
 */
import { ActivityManager } from './activities.js';
import { StatisticsManager } from './statistics.js';
import { StorageEngine } from './storage.js';
import { $, $$, formatDistance } from './utils.js';

export const LandingPageController = {
  init() {
    this.renderQuickStats();
    this.initScrollReveal();
  },

  renderQuickStats() {
    try {
      const activities = ActivityManager.getAll();
      const unit = StorageEngine.getUnits();
      const stats = StatisticsManager.calculateOverview(activities);

      const elKm = $('#hero-stat-km');
      const elSessions = $('#hero-stat-sessions');
      const elCalories = $('#hero-stat-calories');
      const elStreak = $('#hero-stat-streak');

      if (activities.length > 0) {
        if (elKm) elKm.textContent = formatDistance(stats.totalDistanceKm, unit);
        if (elSessions) elSessions.textContent = `${stats.totalActivities}`;
        if (elCalories) elCalories.textContent = `${stats.totalCalories.toLocaleString()} kkal`;
        if (elStreak) elStreak.textContent = `${stats.currentStreak} Hari`;
      } else {
        if (elKm) elKm.textContent = unit === 'miles' ? '77.2 mi' : '124 km';
        if (elSessions) elSessions.textContent = '18 Sesi';
        if (elCalories) elCalories.textContent = '9,240 kkal';
        if (elStreak) elStreak.textContent = '7 Hari';
      }
    } catch (e) {}
  },

  initScrollReveal() {
    const revealElements = $$('.reveal-on-scroll');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }
};

document.addEventListener('DOMContentLoaded', () => {
  LandingPageController.init();
});
