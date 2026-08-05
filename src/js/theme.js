/**
 * HabitPulse Theme Engine & Appearance Manager
 */
import { StorageEngine } from './storage.js';

export const ThemeManager = {
  currentTheme: 'system',

  init() {
    this.currentTheme = StorageEngine.getTheme() || 'system';
    this.applyTheme(this.currentTheme);
    this.listenToSystemChanges();
  },

  applyTheme(theme) {
    this.currentTheme = theme;
    StorageEngine.saveTheme(theme);

    const root = document.documentElement;

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }

    this.updateThemeToggleIcons();
  },

  toggleTheme() {
    const activeEffective = document.documentElement.getAttribute('data-theme');
    const nextTheme = activeEffective === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
  },

  listenToSystemChanges() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.currentTheme === 'system') {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        this.updateThemeToggleIcons();
      }
    });
  },

  updateThemeToggleIcons() {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const effectiveTheme = document.documentElement.getAttribute('data-theme');

    toggleBtns.forEach(btn => {
      if (effectiveTheme === 'dark') {
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
          </svg>
        `;
        btn.setAttribute('aria-label', 'Switch to Light Mode');
      } else {
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
          </svg>
        `;
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
      }
    });
  }
};
