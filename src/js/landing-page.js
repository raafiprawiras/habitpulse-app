/**
 * HabitPulse Landing Page Controller
 * Handles Text Reveal by Lines and Animated Statistics Counter
 */
import { ActivityManager } from './activities.js';
import { StatisticsManager } from './statistics.js';
import { StorageEngine } from './storage.js';
import { $, $$ } from './utils.js';

export const LandingPageController = {
  hasAnimatedCounters: false,

  init() {
    this.initHeroAnimations();
    this.initScrollReveal();
  },

  /**
   * Initialize Hero Section Line Reveal & Animated Statistics Counter
   */
  initHeroAnimations() {
    const heroSection = $('#hero');
    if (!heroSection) return;

    // Use IntersectionObserver to trigger animations when Hero enters view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimatedCounters) {
          this.hasAnimatedCounters = true;
          
          // 1. Trigger Headline Line Reveal
          heroSection.classList.add('revealed');

          // 2. Trigger Animated Statistics Counters (starting smoothly at ~450ms)
          this.startAnimatedCounters();

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    observer.observe(heroSection);
  },

  /**
   * Calculate Actual Stats & Animate Numbers from 0 to Target
   */
  startAnimatedCounters() {
    try {
      const activities = ActivityManager.getAll();
      const unit = StorageEngine.getUnits();
      const stats = StatisticsManager.calculateOverview(activities);

      const elKm = $('#hero-stat-km');
      const elSessions = $('#hero-stat-sessions');
      const elCalories = $('#hero-stat-calories');
      const elStreak = $('#hero-stat-streak');

      let targetKm = 124;
      let targetSessions = 18;
      let targetCalories = 9240;
      let targetStreak = 7;
      let unitSuffix = unit === 'miles' ? 'mi' : 'km';

      if (activities.length > 0) {
        targetKm = unit === 'miles' ? stats.totalDistanceKm * 0.621371 : stats.totalDistanceKm;
        targetSessions = stats.totalActivities;
        targetCalories = stats.totalCalories;
        targetStreak = stats.currentStreak;
      } else if (unit === 'miles') {
        targetKm = 77.2;
      }

      // Animate individual counters with 1200ms duration
      if (elKm) {
        this.animateCounter(elKm, targetKm, {
          duration: 1200,
          delay: 450,
          suffix: unitSuffix,
          isDecimal: targetKm % 1 !== 0
        });
      }

      if (elSessions) {
        this.animateCounter(elSessions, targetSessions, {
          duration: 1200,
          delay: 480,
          suffix: 'sesi'
        });
      }

      if (elCalories) {
        this.animateCounter(elCalories, targetCalories, {
          duration: 1200,
          delay: 510,
          suffix: 'kkal'
        });
      }

      if (elStreak) {
        this.animateCounter(elStreak, targetStreak, {
          duration: 1200,
          delay: 540,
          suffix: 'hari streak'
        });
      }
    } catch (e) {
      console.error('Error starting animated counters:', e);
    }
  },

  /**
   * Time-based Counter Interpolation using requestAnimationFrame & easeOutCubic
   */
  animateCounter(element, targetValue, options = {}) {
    if (!element) return;

    const {
      duration = 1200,
      delay = 450,
      suffix = '',
      isDecimal = false
    } = options;

    // Respect user prefers-reduced-motion setting
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.textContent = this.formatNumber(targetValue, isDecimal, suffix);
      return;
    }

    let startTime = null;

    // EaseOutCubic: Starts fast, decelerates smoothly towards target
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < delay) {
        requestAnimationFrame(step);
        return;
      }

      const animElapsed = elapsed - delay;
      const progress = Math.min(animElapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = targetValue * easedProgress;

      element.textContent = this.formatNumber(currentValue, isDecimal, suffix);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = this.formatNumber(targetValue, isDecimal, suffix);
      }
    };

    requestAnimationFrame(step);
  },

  /**
   * Format numbers according to Indonesian locale standards
   */
  formatNumber(val, isDecimal, suffix) {
    let formatted = '';
    if (isDecimal) {
      formatted = val.toFixed(1).replace('.', ',');
    } else {
      formatted = new Intl.NumberFormat('id-ID').format(Math.round(val));
    }
    return suffix ? `${formatted} ${suffix}` : formatted;
  },

  /**
   * Scroll Reveal for lower section cards
   */
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
