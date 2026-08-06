/**
 * HabitPulse LocalStorage Wrapper Engine & Single Source of Truth
 */

const STORAGE_KEYS = {
  ACTIVITIES: 'habitpulse_activities',
  THEME: 'habitpulse_theme',
  WEEKLY_GOALS: 'habitpulse_weekly_goals',
  UNITS: 'habitpulse_units',
  SETTINGS: 'habitpulse_settings',
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

export const DEFAULT_SETTINGS = {
  profile: {
    displayName: 'Athlete',
    defaultActivity: 'running'
  },
  appearance: {
    theme: 'system',
    density: 'comfortable'
  },
  activity: {
    unit: 'km',
    numberFormat: 'id-ID',
    weekStart: 'monday',
    timeFormat: '24h',
    showCalories: true
  },
  goals: {
    showAchievements: true
  },
  notifications: {
    notifyAchievement: true,
    notifyWeeklyGoal: true,
    notifyStreak: true
  },
  accessibility: {
    reduceMotion: 'system',
    textSize: 'normal',
    highContrast: false
  }
};

/**
 * Deep merge source object into target object for default fallback
 */
function mergeDeep(target, source) {
  const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);
  const output = Object.assign({}, target);

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        if (target[key] === undefined || target[key] === null) {
          Object.assign(output, { [key]: source[key] });
        }
      }
    });
  }
  return output;
}

export const StorageEngine = {
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

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[StorageEngine] Error saving key "${key}":`, error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Ignore
    }
  },

  getActivities() {
    const data = this.get(STORAGE_KEYS.ACTIVITIES, null);
    if (!data || !Array.isArray(data)) {
      this.set(STORAGE_KEYS.ACTIVITIES, INITIAL_SEED_ACTIVITIES);
      return INITIAL_SEED_ACTIVITIES;
    }
    return data;
  },

  saveActivities(activities) {
    return this.set(STORAGE_KEYS.ACTIVITIES, activities);
  },

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

  saveWeeklyGoals(goals) {
    const updated = {
      targetActivities: Number(goals.targetActivities) || DEFAULT_WEEKLY_GOALS.targetActivities,
      targetMinutes: Number(goals.targetMinutes) || DEFAULT_WEEKLY_GOALS.targetMinutes,
      targetDistance: Number(goals.targetDistance) || DEFAULT_WEEKLY_GOALS.targetDistance,
      targetCalories: Number(goals.targetCalories) || DEFAULT_WEEKLY_GOALS.targetCalories
    };
    return this.set(STORAGE_KEYS.WEEKLY_GOALS, updated);
  },

  getUnlockedAchievements() {
    return this.get(STORAGE_KEYS.UNLOCKED_ACHIEVEMENTS, {}) || {};
  },

  saveUnlockedAchievements(map) {
    return this.set(STORAGE_KEYS.UNLOCKED_ACHIEVEMENTS, map);
  },

  getSettings() {
    const rawSettings = this.get(STORAGE_KEYS.SETTINGS, null);
    
    // Migrate legacy keys if settings key is missing
    const legacyTheme = this.get(STORAGE_KEYS.THEME, null);
    const legacyUnits = this.get(STORAGE_KEYS.UNITS, null);

    const base = rawSettings || {};
    if (legacyTheme && !base.appearance?.theme) {
      base.appearance = base.appearance || {};
      base.appearance.theme = legacyTheme;
    }
    if (legacyUnits && !base.activity?.unit) {
      base.activity = base.activity || {};
      base.activity.unit = legacyUnits;
    }

    const merged = mergeDeep(base, DEFAULT_SETTINGS);
    if (!rawSettings) {
      this.set(STORAGE_KEYS.SETTINGS, merged);
    }
    return merged;
  },

  saveSettings(settings) {
    const merged = mergeDeep(settings, DEFAULT_SETTINGS);
    this.set(STORAGE_KEYS.SETTINGS, merged);
    // Sync legacy keys for backward compatibility
    this.set(STORAGE_KEYS.THEME, merged.appearance.theme);
    this.set(STORAGE_KEYS.UNITS, merged.activity.unit);
    return merged;
  },

  updateSetting(category, key, value) {
    const settings = this.getSettings();
    if (!settings[category]) {
      settings[category] = {};
    }
    settings[category][key] = value;
    return this.saveSettings(settings);
  },

  resetSettings() {
    this.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    this.set(STORAGE_KEYS.THEME, DEFAULT_SETTINGS.appearance.theme);
    this.set(STORAGE_KEYS.UNITS, DEFAULT_SETTINGS.activity.unit);
    return DEFAULT_SETTINGS;
  },

  getUnits() {
    return this.getSettings().activity.unit || 'km';
  },

  saveUnits(unit) {
    return this.updateSetting('activity', 'unit', unit === 'miles' ? 'miles' : 'km');
  },

  getTheme() {
    return this.getSettings().appearance.theme || 'system';
  },

  saveTheme(theme) {
    return this.updateSetting('appearance', 'theme', theme);
  },

  exportAllData() {
    return {
      appName: 'HabitPulse',
      schemaVersion: '1.0',
      exportedAt: new Date().toISOString(),
      activities: this.getActivities(),
      weeklyGoals: this.getWeeklyGoals(),
      settings: this.getSettings(),
      unlockedAchievements: this.getUnlockedAchievements()
    };
  },

  importData(importObj) {
    if (!importObj || typeof importObj !== 'object') {
      return { success: false, error: 'Format file JSON tidak valid.' };
    }

    if (!Array.isArray(importObj.activities)) {
      return { success: false, error: 'Data aktivitas tidak ditemukan dalam file backup.' };
    }

    try {
      this.saveActivities(importObj.activities);
      if (importObj.weeklyGoals) this.saveWeeklyGoals(importObj.weeklyGoals);
      if (importObj.settings) this.saveSettings(importObj.settings);
      if (importObj.unlockedAchievements) this.saveUnlockedAchievements(importObj.unlockedAchievements);

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message || 'Gagal memulihkan data.' };
    }
  },

  clearAllData() {
    try {
      localStorage.clear();
      this.set(STORAGE_KEYS.ACTIVITIES, []);
      this.set(STORAGE_KEYS.WEEKLY_GOALS, DEFAULT_WEEKLY_GOALS);
      this.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      this.set(STORAGE_KEYS.UNLOCKED_ACHIEVEMENTS, {});
      return true;
    } catch (e) {
      return false;
    }
  }
};

