/**
 * HabitPulse LocalStorage Wrapper Engine
 */

const STORAGE_KEYS = {
  ACTIVITIES: 'habitpulse_activities',
  THEME: 'habitpulse_theme',
  WEEKLY_GOALS: 'habitpulse_weekly_goals',
  UNITS: 'habitpulse_units',
  USER_SETTINGS: 'habitpulse_user_settings',
  UNLOCKED_ACHIEVEMENTS: 'habitpulse_unlocked_achievements'
};

const INITIAL_SEED_ACTIVITIES = [
  {
    id: 'act_seed_1',
    type: 'running',
    title: 'Lari Pagi Keliling Komplek',
    date: new Date().toISOString().split('T')[0],
    duration: 35,
    distance: 5.2,
    intensity: 'moderate',
    calories: 340,
    notes: 'Kondisi badan fit, pace stabil 6:43/km'
  },
  {
    id: 'act_seed_2',
    type: 'cycling',
    title: 'Gowes Santai Sore Hari',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    duration: 60,
    distance: 18.5,
    intensity: 'moderate',
    calories: 450,
    notes: 'Rute Jalur Kota & Taman'
  },
  {
    id: 'act_seed_3',
    type: 'workout',
    title: 'Upper Body Strength Workout',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    duration: 45,
    distance: 0,
    intensity: 'intense',
    calories: 280,
    notes: 'Focus Push-up, Dumbbell Press & Core'
  },
  {
    id: 'act_seed_4',
    type: 'walking',
    title: 'Jalan Santai Malam Hari',
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    duration: 30,
    distance: 2.8,
    intensity: 'light',
    calories: 130,
    notes: 'Jalan santai setelah makan malam'
  }
];

const DEFAULT_WEEKLY_GOALS = {
  targetActivities: 4,
  targetMinutes: 150,
  targetDistance: 20,
  targetCalories: 1500
};

export const StorageEngine = {
  /**
   * Safe getter from LocalStorage with corruption recovery
   * @template T
   * @param {string} key 
   * @param {T} fallback 
   * @returns {T}
   */
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      const parsed = JSON.parse(item);
      return parsed !== null ? parsed : fallback;
    } catch (error) {
      console.error(`[StorageEngine] Corrupted data for key "${key}", resetting:`, error);
      this.remove(key);
      return fallback;
    }
  },

  /**
   * Safe setter to LocalStorage
   * @param {string} key 
   * @param {any} value 
   * @returns {boolean}
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[StorageEngine] Error saving key "${key}":`, error);
      return false;
    }
  },

  /**
   * Remove item key
   * @param {string} key 
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Ignore
    }
  },

  /**
   * Get all stored activities
   * @returns {Array<Object>}
   */
  getActivities() {
    const data = this.get(STORAGE_KEYS.ACTIVITIES, null);
    if (!data || !Array.isArray(data)) {
      this.set(STORAGE_KEYS.ACTIVITIES, INITIAL_SEED_ACTIVITIES);
      return INITIAL_SEED_ACTIVITIES;
    }
    return data;
  },

  /**
   * Save activities list to LocalStorage
   * @param {Array<Object>} activities 
   */
  saveActivities(activities) {
    return this.set(STORAGE_KEYS.ACTIVITIES, activities);
  },

  /**
   * Get Weekly Goals configuration
   * @returns {{targetActivities: number, targetMinutes: number, targetDistance: number, targetCalories: number}}
   */
  getWeeklyGoals() {
    const goals = this.get(STORAGE_KEYS.WEEKLY_GOALS, null);
    if (!goals) {
      this.set(STORAGE_KEYS.WEEKLY_GOALS, DEFAULT_WEEKLY_GOALS);
      return DEFAULT_WEEKLY_GOALS;
    }
    return {
      targetActivities: goals.targetActivities || DEFAULT_WEEKLY_GOALS.targetActivities,
      targetMinutes: goals.targetMinutes || DEFAULT_WEEKLY_GOALS.targetMinutes,
      targetDistance: goals.targetDistance || DEFAULT_WEEKLY_GOALS.targetDistance,
      targetCalories: goals.targetCalories || DEFAULT_WEEKLY_GOALS.targetCalories
    };
  },

  /**
   * Save Weekly Goals configuration
   * @param {Object} goals 
   */
  saveWeeklyGoals(goals) {
    const updated = {
      targetActivities: Number(goals.targetActivities) || DEFAULT_WEEKLY_GOALS.targetActivities,
      targetMinutes: Number(goals.targetMinutes) || DEFAULT_WEEKLY_GOALS.targetMinutes,
      targetDistance: Number(goals.targetDistance) || DEFAULT_WEEKLY_GOALS.targetDistance,
      targetCalories: Number(goals.targetCalories) || DEFAULT_WEEKLY_GOALS.targetCalories
    };
    return this.set(STORAGE_KEYS.WEEKLY_GOALS, updated);
  },

  /**
   * Get unlocked achievements metadata map
   * @returns {Object<string, {unlockedAt: string, notified: boolean}>}
   */
  getUnlockedAchievements() {
    return this.get(STORAGE_KEYS.UNLOCKED_ACHIEVEMENTS, {}) || {};
  },

  /**
   * Save unlocked achievements metadata map
   * @param {Object} map 
   */
  saveUnlockedAchievements(map) {
    return this.set(STORAGE_KEYS.UNLOCKED_ACHIEVEMENTS, map);
  },

  /**
   * Get unit system preference ('km' | 'miles')
   * @returns {string}
   */
  getUnits() {
    return this.get(STORAGE_KEYS.UNITS, 'km');
  },

  /**
   * Save unit system preference
   * @param {string} unit 'km' | 'miles'
   */
  saveUnits(unit) {
    return this.set(STORAGE_KEYS.UNITS, unit === 'miles' ? 'miles' : 'km');
  },

  /**
   * Get theme preference ('light' | 'dark' | 'system')
   * @returns {string}
   */
  getTheme() {
    return this.get(STORAGE_KEYS.THEME, 'system');
  },

  /**
   * Save theme preference
   * @param {string} theme 'light' | 'dark' | 'system'
   */
  saveTheme(theme) {
    return this.set(STORAGE_KEYS.THEME, theme);
  },

  /**
   * Export all HabitPulse data to JSON backup object
   * @returns {Object}
   */
  exportAllData() {
    return {
      appName: 'HabitPulse',
      schemaVersion: '1.0',
      exportedAt: new Date().toISOString(),
      activities: this.getActivities(),
      weeklyGoals: this.getWeeklyGoals(),
      units: this.getUnits(),
      theme: this.getTheme()
    };
  },

  /**
   * Validate and import JSON backup data
   * @param {Object} importObj 
   * @returns {{success: boolean, error?: string}}
   */
  importData(importObj) {
    if (!importObj || typeof importObj !== 'object') {
      return { success: false, error: 'File format invalid.' };
    }

    if (!Array.isArray(importObj.activities)) {
      return { success: false, error: 'No activities data array found in JSON file.' };
    }

    try {
      this.saveActivities(importObj.activities);
      if (importObj.weeklyGoals) this.saveWeeklyGoals(importObj.weeklyGoals);
      if (importObj.units) this.saveUnits(importObj.units);
      if (importObj.theme) this.saveTheme(importObj.theme);

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message || 'Import failed.' };
    }
  },

  /**
   * Clear all stored data
   */
  clearAllData() {
    try {
      localStorage.clear();
      this.set(STORAGE_KEYS.ACTIVITIES, []);
      this.set(STORAGE_KEYS.WEEKLY_GOALS, DEFAULT_WEEKLY_GOALS);
      return true;
    } catch (e) {
      return false;
    }
  }
};
