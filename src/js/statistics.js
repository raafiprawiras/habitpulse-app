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
      totalActivities: activities.length,
      totalDistanceKm: 0,
      totalDurationMins: 0,
      totalCalories: 0,
      avgDurationMins: 0,
      mostActiveSport: '-',

      currentStreak: 0,
      bestStreak: 0,

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

      byType: {
        running: { count: 0, distance: 0, duration: 0, calories: 0, percentage: 0 },
        cycling: { count: 0, distance: 0, duration: 0, calories: 0, percentage: 0 },
        walking: { count: 0, distance: 0, duration: 0, calories: 0, percentage: 0 },
        workout: { count: 0, distance: 0, duration: 0, calories: 0, percentage: 0 }
      },

      achievements: [],
      motivationalMessage: ''
    };

    if (activities.length === 0) {
      stats.achievements = this.calculateAchievements(activities, stats);
      stats.motivationalMessage = "Mulai aktivitas pertamamu minggu ini!";
      return stats;
    }

    activities.forEach(act => {
      const distance = Number(act.distance) || 0;
      const duration = Number(act.duration) || 0;
      const calories = Number(act.calories) || 0;

      stats.totalDistanceKm += distance;
      stats.totalDurationMins += duration;
      stats.totalCalories += calories;

      if (isDateInCurrentWeek(act.date)) {
        stats.weekly.activitiesCount += 1;
        stats.weekly.totalDistanceKm += distance;
        stats.weekly.totalDurationMins += duration;
        stats.weekly.totalCalories += calories;
      }

      if (stats.byType[act.type]) {
        stats.byType[act.type].count += 1;
        stats.byType[act.type].distance += distance;
        stats.byType[act.type].duration += duration;
        stats.byType[act.type].calories += calories;
      }
    });

    stats.avgDurationMins = Math.round(stats.totalDurationMins / activities.length);

    let maxCount = -1;
    const typeLabels = { running: 'Lari', cycling: 'Bersepeda', walking: 'Jalan Kaki', workout: 'Workout' };
    Object.keys(stats.byType).forEach(type => {
      const count = stats.byType[type].count;
      if (count > maxCount && count > 0) {
        maxCount = count;
        stats.mostActiveSport = typeLabels[type] || type;
      }
    });

    stats.weekly.activitiesPct = Math.min(Math.round((stats.weekly.activitiesCount / goals.targetActivities) * 100), 100);
    stats.weekly.minutesPct = Math.min(Math.round((stats.weekly.totalDurationMins / goals.targetMinutes) * 100), 100);
    stats.weekly.distancePct = Math.min(Math.round((stats.weekly.totalDistanceKm / goals.targetDistance) * 100), 100);
    stats.weekly.goalPercentage = stats.weekly.activitiesPct;

    const streaks = this.calculateStreak(activities);
    stats.currentStreak = streaks.currentStreak;
    stats.bestStreak = streaks.bestStreak;

    stats.achievements = this.calculateAchievements(activities, stats);
    stats.motivationalMessage = this.generateMotivationalMessage(stats.weekly);

    return stats;
  },

  /**
   * Group activities into 4 calendar weeks for Trend Chart
   * @param {Array<Object>} activities 
   * @returns {Array<Object>}
   */
  calculateFourWeeksTrend(activities = []) {
    const now = new Date();
    const currentDay = now.getDay();
    const diffToMon = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const thisWeekMon = new Date(now.getFullYear(), now.getMonth(), diffToMon, 0, 0, 0, 0);

    const msPerWeek = 7 * 24 * 60 * 60 * 1000;

    const weeks = [
      {
        label: '4 minggu lalu',
        start: new Date(thisWeekMon.getTime() - 3 * msPerWeek),
        end: new Date(thisWeekMon.getTime() - 2 * msPerWeek - 1),
        minutes: 0,
        distance: 0,
        sessions: 0
      },
      {
        label: '3 minggu lalu',
        start: new Date(thisWeekMon.getTime() - 2 * msPerWeek),
        end: new Date(thisWeekMon.getTime() - 1 * msPerWeek - 1),
        minutes: 0,
        distance: 0,
        sessions: 0
      },
      {
        label: '2 minggu lalu',
        start: new Date(thisWeekMon.getTime() - 1 * msPerWeek),
        end: new Date(thisWeekMon.getTime() - 1),
        minutes: 0,
        distance: 0,
        sessions: 0
      },
      {
        label: 'Minggu ini',
        start: thisWeekMon,
        end: new Date(thisWeekMon.getTime() + msPerWeek - 1),
        minutes: 0,
        distance: 0,
        sessions: 0
      }
    ];

    activities.forEach(act => {
      if (!act.date) return;
      const d = new Date(act.date);
      if (isNaN(d.getTime())) return;

      weeks.forEach(w => {
        if (d >= w.start && d <= w.end) {
          w.minutes += Number(act.duration) || 0;
          w.distance += Number(act.distance) || 0;
          w.sessions += 1;
        }
      });
    });

    return weeks;
  },

  /**
   * Aggregate category metrics & HR check
   * @param {Array<Object>} activities 
   * @returns {Object}
   */
  calculateCategoryMetrics(activities = []) {
    const categories = {
      running: { key: 'running', name: 'Lari', color: '#7CE424', count: 0, duration: 0, distance: 0, hrSum: 0, hrCount: 0 },
      cycling: { key: 'cycling', name: 'Bersepeda', color: '#38BDF8', count: 0, duration: 0, distance: 0, hrSum: 0, hrCount: 0 },
      walking: { key: 'walking', name: 'Jalan Kaki', color: '#A855F7', count: 0, duration: 0, distance: 0, hrSum: 0, hrCount: 0 },
      workout: { key: 'workout', name: 'Workout', color: '#F97316', count: 0, duration: 0, distance: 0, hrSum: 0, hrCount: 0 }
    };

    let totalDuration = 0;
    let totalHRCount = 0;

    activities.forEach(act => {
      const cat = categories[act.type];
      if (cat) {
        cat.count += 1;
        const dur = Number(act.duration) || 0;
        cat.duration += dur;
        totalDuration += dur;
        cat.distance += Number(act.distance) || 0;

        if (act.heartRate && Number(act.heartRate) > 0) {
          cat.hrSum += Number(act.heartRate);
          cat.hrCount += 1;
          totalHRCount += 1;
        }
      }
    });

    Object.keys(categories).forEach(k => {
      const c = categories[k];
      c.percentage = totalDuration > 0 ? Math.round((c.duration / totalDuration) * 100) : 0;
      c.avgDuration = c.count > 0 ? Math.round(c.duration / c.count) : 0;
      c.avgHR = c.hrCount > 0 ? Math.round(c.hrSum / c.hrCount) : 0;
    });

    return {
      categories,
      totalDuration,
      hasHRData: totalHRCount > 0
    };
  },

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

  calculateAchievements(activities = [], stats = {}) {
    const totalActs = activities.length;
    const totalDist = stats.totalDistanceKm || 0;
    const maxStreak = Math.max(stats.currentStreak || 0, stats.bestStreak || 0);

    return [
      {
        id: 'ach_first_act',
        title: 'Aktivitas Pertama',
        description: 'Catat sesi latihan pertamamu',
        icon: '🎯',
        unlocked: totalActs >= 1,
        progressText: totalActs >= 1 ? 'Terbuka' : '0/1 Sesi'
      },
      {
        id: 'ach_5_acts',
        title: '5 Aktivitas',
        description: 'Selesaikan 5 sesi latihan kebugaran',
        icon: '🏆',
        unlocked: totalActs >= 5,
        progressText: totalActs >= 5 ? 'Terbuka' : `${totalActs}/5 Sesi`
      },
      {
        id: 'ach_10_acts',
        title: '10 Aktivitas',
        description: 'Mencapai pencapaian 10 aktivitas',
        icon: '🥇',
        unlocked: totalActs >= 10,
        progressText: totalActs >= 10 ? 'Terbuka' : `${totalActs}/10 Sesi`
      },
      {
        id: 'ach_first_10km',
        title: '10 KM Pertama',
        description: 'Kumpulkan total jarak 10 km',
        icon: '📍',
        unlocked: totalDist >= 10,
        progressText: totalDist >= 10 ? 'Terbuka' : `${totalDist.toFixed(1)}/10 KM`
      },
      {
        id: 'ach_7day_streak',
        title: '7 Hari Streak',
        description: 'Pertahankan streak 7 hari berturut-turut',
        icon: '🔥',
        unlocked: maxStreak >= 7,
        progressText: maxStreak >= 7 ? 'Terbuka' : `${maxStreak}/7 Hari`
      }
    ];
  },

  generateMotivationalMessage(weekly = {}) {
    const count = weekly.activitiesCount || 0;
    const target = weekly.targetActivities || 5;

    if (count === 0) {
      return "Mulai aktivitas pertamamu minggu ini!";
    } else if (count >= target) {
      return "Target mingguan tercapai! Pertahankan konsistensi.";
    } else {
      const remaining = target - count;
      return `Bagus! Kurang ${remaining} aktivitas lagi untuk mencapai target mingguan.`;
    }
  }
};

