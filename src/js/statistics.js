/**
 * HabitPulse Analytics & Statistics Engine
 */
import { isDateInCurrentWeek } from './utils.js';
import { StorageEngine } from './storage.js';

export const StatisticsManager = {
  /**
   * Calculate complete overview, weekly goals, streaks, achievements, and category breakdown
   * @param {Array<Object>} activities 
   * @returns {Object}
   */
  calculateOverview(activities = []) {
    const goals = StorageEngine.getWeeklyGoals();

    const stats = {
      // Overall totals
      totalActivities: activities.length,
      totalDistanceKm: 0,
      totalDurationMins: 0,
      totalCalories: 0,
      avgDurationMins: 0,
      mostActiveSport: '-',

      // Streaks
      currentStreak: 0,
      bestStreak: 0,

      // Current week metrics & goals
      weekly: {
        activitiesCount: 0,
        totalDistanceKm: 0,
        totalDurationMins: 0,
        totalCalories: 0,
        targetActivities: goals.targetActivities,
        targetMinutes: goals.targetMinutes,
        targetDistance: goals.targetDistance,
        activitiesPct: 0,
        minutesPct: 0,
        distancePct: 0,
        goalPercentage: 0
      },

      // Breakdown by sport category
      byType: {
        running: { count: 0, distance: 0, duration: 0, calories: 0, percentage: 0 },
        cycling: { count: 0, distance: 0, duration: 0, calories: 0, percentage: 0 },
        walking: { count: 0, distance: 0, duration: 0, calories: 0, percentage: 0 },
        workout: { count: 0, distance: 0, duration: 0, calories: 0, percentage: 0 }
      },

      // Achievements status
      achievements: [],

      // Motivational Message
      motivationalMessage: ''
    };

    if (activities.length === 0) {
      stats.achievements = this.calculateAchievements(activities, stats);
      stats.motivationalMessage = "Start your first activity this week to build your health streak!";
      return stats;
    }

    // Process each activity
    activities.forEach(act => {
      const distance = Number(act.distance) || 0;
      const duration = Number(act.duration) || 0;
      const calories = Number(act.calories) || 0;

      stats.totalDistanceKm += distance;
      stats.totalDurationMins += duration;
      stats.totalCalories += calories;

      // Current week processing
      if (isDateInCurrentWeek(act.date)) {
        stats.weekly.activitiesCount += 1;
        stats.weekly.totalDistanceKm += distance;
        stats.weekly.totalDurationMins += duration;
        stats.weekly.totalCalories += calories;
      }

      // Category breakdown
      if (stats.byType[act.type]) {
        stats.byType[act.type].count += 1;
        stats.byType[act.type].distance += distance;
        stats.byType[act.type].duration += duration;
        stats.byType[act.type].calories += calories;
      }
    });

    // Average duration
    stats.avgDurationMins = Math.round(stats.totalDurationMins / activities.length);

    // Most active sport
    let maxCount = -1;
    const typeLabels = { running: 'Lari', cycling: 'Bersepeda', walking: 'Jalan Kaki', workout: 'Workout' };
    Object.keys(stats.byType).forEach(type => {
      const count = stats.byType[type].count;
      if (count > maxCount && count > 0) {
        maxCount = count;
        stats.mostActiveSport = typeLabels[type] || type;
      }
    });

    // Goal Percentages
    stats.weekly.activitiesPct = Math.min(Math.round((stats.weekly.activitiesCount / goals.targetActivities) * 100), 100);
    stats.weekly.minutesPct = Math.min(Math.round((stats.weekly.totalDurationMins / goals.targetMinutes) * 100), 100);
    stats.weekly.distancePct = Math.min(Math.round((stats.weekly.totalDistanceKm / goals.targetDistance) * 100), 100);
    stats.weekly.goalPercentage = stats.weekly.activitiesPct;

    // Calculate Streaks
    const streaks = this.calculateStreak(activities);
    stats.currentStreak = streaks.currentStreak;
    stats.bestStreak = streaks.bestStreak;

    // Achievements
    stats.achievements = this.calculateAchievements(activities, stats);

    // Motivational Message
    stats.motivationalMessage = this.generateMotivationalMessage(stats.weekly);

    return stats;
  },

  /**
   * Timezone-safe Activity Streak Calculator
   * @param {Array<Object>} activities 
   * @returns {{currentStreak: number, bestStreak: number}}
   */
  calculateStreak(activities = []) {
    if (activities.length === 0) return { currentStreak: 0, bestStreak: 0 };

    const dateSet = new Set();
    activities.forEach(act => {
      if (act.date) {
        dateSet.add(act.date.split('T')[0]);
      }
    });

    const sortedDates = Array.from(dateSet).sort((a, b) => new Date(a) - new Date(b));
    if (sortedDates.length === 0) return { currentStreak: 0, bestStreak: 0 };

    let bestStreak = 1;
    let currentTempStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);

      const diffTime = curr.getTime() - prev.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

      if (diffDays === 1) {
        currentTempStreak++;
        if (currentTempStreak > bestStreak) {
          bestStreak = currentTempStreak;
        }
      } else if (diffDays > 1) {
        currentTempStreak = 1;
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const lastActiveDate = new Date(sortedDates[sortedDates.length - 1]);
    lastActiveDate.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    if (lastActiveDate.getTime() === today.getTime() || lastActiveDate.getTime() === yesterday.getTime()) {
      currentStreak = currentTempStreak;
    }

    return {
      currentStreak,
      bestStreak: Math.max(bestStreak, currentStreak)
    };
  },

  /**
   * Calculate dynamic milestone achievements
   * @param {Array<Object>} activities 
   * @param {Object} stats 
   * @returns {Array<Object>}
   */
  calculateAchievements(activities = [], stats = {}) {
    const totalActs = activities.length;
    const totalDist = stats.totalDistanceKm || 0;
    const maxStreak = Math.max(stats.currentStreak || 0, stats.bestStreak || 0);

    return [
      {
        id: 'ach_first_act',
        title: 'First Activity',
        description: 'Record your very first workout activity',
        icon: '🎯',
        unlocked: totalActs >= 1,
        progressText: totalActs >= 1 ? 'Unlocked' : '0/1 Activity'
      },
      {
        id: 'ach_5_acts',
        title: '5 Activities',
        description: 'Complete 5 fitness sessions',
        icon: '🏆',
        unlocked: totalActs >= 5,
        progressText: totalActs >= 5 ? 'Unlocked' : `${totalActs}/5 Activities`
      },
      {
        id: 'ach_10_acts',
        title: '10 Activities',
        description: 'Reach 10 completed activities milestone',
        icon: '🥇',
        unlocked: totalActs >= 10,
        progressText: totalActs >= 10 ? 'Unlocked' : `${totalActs}/10 Activities`
      },
      {
        id: 'ach_first_10km',
        title: 'First 10 KM',
        description: 'Accumulate 10 km total distance',
        icon: '📍',
        unlocked: totalDist >= 10,
        progressText: totalDist >= 10 ? 'Unlocked' : `${totalDist.toFixed(1)}/10 KM`
      },
      {
        id: 'ach_7day_streak',
        title: '7 Day Streak',
        description: 'Maintain a 7 consecutive days activity streak',
        icon: '🔥',
        unlocked: maxStreak >= 7,
        progressText: maxStreak >= 7 ? 'Unlocked' : `${maxStreak}/7 Days`
      }
    ];
  },

  /**
   * Generate data-backed motivational message
   * @param {Object} weekly 
   * @returns {string}
   */
  generateMotivationalMessage(weekly = {}) {
    const count = weekly.activitiesCount || 0;
    const target = weekly.targetActivities || 5;

    if (count === 0) {
      return "Start your first activity this week to build your health streak!";
    } else if (count >= target) {
      return "Weekly goal completed. Keep the momentum going!";
    } else {
      const remaining = target - count;
      if (remaining === 1) {
        return "Great progress! You're 1 activity away from your weekly goal.";
      }
      return `Great progress! You're ${remaining} activities away from your weekly goal.`;
    }
  }
};
