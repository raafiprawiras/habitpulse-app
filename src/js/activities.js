/**
 * HabitPulse Activities Data Store & Model Manager
 */
import { StorageEngine } from './storage.js';
import { generateUniqueId, isDateInCurrentWeek } from './utils.js';

export const ActivityManager = {
  activities: [],

  /**
   * Initialize activities from local storage
   */
  init() {
    this.activities = StorageEngine.getActivities();
    return this.activities;
  },

  /**
   * Get all activities
   * @returns {Array<Object>}
   */
  getAll() {
    return [...this.activities];
  },

  /**
   * Get filtered activities by category
   * @param {string} filterType 
   * @returns {Array<Object>}
   */
  getFiltered(filterType = 'all') {
    if (filterType === 'all') return this.getAll();
    return this.activities.filter(act => act.type === filterType);
  },

  /**
   * Execute multi-criteria search, filter, and sorting query
   * @param {Object} options 
   * @param {string} [options.category='all']
   * @param {string} [options.timeRange='all'] 'all' | 'this-week' | 'this-month'
   * @param {string} [options.sortBy='newest'] 'newest' | 'oldest' | 'longest-duration' | 'highest-distance' | 'most-calories'
   * @param {string} [options.searchQuery='']
   * @returns {Array<Object>}
   */
  query({ category = 'all', timeRange = 'all', sortBy = 'newest', searchQuery = '' } = {}) {
    let result = [...this.activities];

    // 1. Filter by Category
    if (category && category !== 'all') {
      result = result.filter(act => act.type === category);
    }

    // 2. Filter by Time Range
    if (timeRange && timeRange !== 'all') {
      const now = new Date();
      if (timeRange === 'this-week') {
        result = result.filter(act => isDateInCurrentWeek(act.date));
      } else if (timeRange === 'this-month') {
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        result = result.filter(act => {
          const d = new Date(act.date);
          return !isNaN(d.getTime()) && d.getFullYear() === currentYear && d.getMonth() === currentMonth;
        });
      }
    }

    // 3. Filter by Search Query (Title or Notes)
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(act => {
        const titleMatch = act.title && act.title.toLowerCase().includes(q);
        const notesMatch = act.notes && act.notes.toLowerCase().includes(q);
        return titleMatch || notesMatch;
      });
    }

    // 4. Sort Results
    result.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'longest-duration') {
        return (Number(b.duration) || 0) - (Number(a.duration) || 0);
      } else if (sortBy === 'highest-distance') {
        return (Number(b.distance) || 0) - (Number(a.distance) || 0);
      } else if (sortBy === 'most-calories') {
        return (Number(b.calories) || 0) - (Number(a.calories) || 0);
      } else {
        // Default: newest
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return result;
  },

  /**
   * Get single activity by ID
   * @param {string} id 
   * @returns {Object|null}
   */
  getById(id) {
    return this.activities.find(act => act.id === id) || null;
  },

  /**
   * Add a new activity
   * @param {Object} activityData 
   * @returns {Object} Newly created activity object
   */
  add(activityData) {
    const newActivity = {
      id: generateUniqueId(),
      type: activityData.type,
      title: activityData.title.trim(),
      date: activityData.date,
      duration: Number(activityData.duration) || 0,
      distance: Number(activityData.distance) || 0,
      intensity: activityData.intensity || 'moderate',
      calories: Number(activityData.calories) || 0,
      heartRate: Number(activityData.heartRate) || 0,
      notes: (activityData.notes || '').trim(),
      createdAt: new Date().toISOString()
    };

    this.activities.unshift(newActivity);
    StorageEngine.saveActivities(this.activities);

    return newActivity;
  },

  /**
   * Update an existing activity
   * @param {string} id 
   * @param {Object} updatedData 
   * @returns {Object|null}
   */
  update(id, updatedData) {
    const index = this.activities.findIndex(act => act.id === id);
    if (index === -1) return null;

    const existing = this.activities[index];
    const updatedActivity = {
      ...existing,
      type: updatedData.type || existing.type,
      title: (updatedData.title || existing.title).trim(),
      date: updatedData.date || existing.date,
      duration: Number(updatedData.duration) || existing.duration,
      distance: Number(updatedData.distance) || 0,
      intensity: updatedData.intensity || existing.intensity || 'moderate',
      calories: Number(updatedData.calories) || 0,
      heartRate: Number(updatedData.heartRate) || 0,
      notes: (updatedData.notes !== undefined ? updatedData.notes : existing.notes).trim(),
      updatedAt: new Date().toISOString()
    };

    this.activities[index] = updatedActivity;
    StorageEngine.saveActivities(this.activities);

    return updatedActivity;
  },

  /**
   * Delete an activity by ID
   * @param {string} id 
   * @returns {boolean} Success status
   */
  delete(id) {
    const initialLength = this.activities.length;
    this.activities = this.activities.filter(act => act.id !== id);

    if (this.activities.length < initialLength) {
      StorageEngine.saveActivities(this.activities);
      return true;
    }
    return false;
  }
};
