/**
 * HabitPulse Achievements & Goal Controller & Engine
 */
import { ActivityManager } from './activities.js';
import { StatisticsManager } from './statistics.js';
import { StorageEngine } from './storage.js';
import { DashboardController } from './dashboard.js';
import { $, $$, formatDistance } from './utils.js';
import { Icons } from './icons.js';

export const ACHIEVEMENTS_DEFINITIONS = [
  // 1. Getting Started
  {
    id: 'ach_first_pulse',
    title: 'First Pulse',
    description: 'Catat aktivitas pertamamu.',
    category: 'general',
    iconName: 'pulse',
    evaluate: (aggr) => {
      const current = aggr.totalSessions;
      const target = 1;
      return { unlocked: current >= target, current, target, unit: 'sesi' };
    }
  },
  {
    id: 'ach_getting_started',
    title: 'Getting Started',
    description: 'Selesaikan 5 sesi latihan.',
    category: 'general',
    iconName: 'trophy',
    evaluate: (aggr) => {
      const current = aggr.totalSessions;
      const target = 5;
      return { unlocked: current >= target, current, target, unit: 'sesi' };
    }
  },
  {
    id: 'ach_active_ten',
    title: 'Active Ten',
    description: 'Selesaikan 10 sesi latihan.',
    category: 'general',
    iconName: 'trophy',
    evaluate: (aggr) => {
      const current = aggr.totalSessions;
      const target = 10;
      return { unlocked: current >= target, current, target, unit: 'sesi' };
    }
  },
  {
    id: 'ach_committed',
    title: 'Committed',
    description: 'Selesaikan 25 sesi latihan.',
    category: 'general',
    iconName: 'trophy',
    evaluate: (aggr) => {
      const current = aggr.totalSessions;
      const target = 25;
      return { unlocked: current >= target, current, target, unit: 'sesi' };
    }
  },
  {
    id: 'ach_half_century',
    title: 'Half Century',
    description: 'Selesaikan 50 sesi latihan.',
    category: 'general',
    iconName: 'trophy',
    evaluate: (aggr) => {
      const current = aggr.totalSessions;
      const target = 50;
      return { unlocked: current >= target, current, target, unit: 'sesi' };
    }
  },
  {
    id: 'ach_century_club',
    title: 'Century Club',
    description: 'Selesaikan 100 sesi latihan.',
    category: 'general',
    iconName: 'trophy',
    evaluate: (aggr) => {
      const current = aggr.totalSessions;
      const target = 100;
      return { unlocked: current >= target, current, target, unit: 'sesi' };
    }
  },

  // 2. Streak
  {
    id: 'ach_streak_3',
    title: 'Streak 3',
    description: 'Latihan 3 hari beruntun.',
    category: 'streak',
    iconName: 'flame',
    evaluate: (aggr) => {
      const current = aggr.bestStreak;
      const target = 3;
      return { unlocked: current >= target, current, target, unit: 'hari' };
    }
  },
  {
    id: 'ach_streak_7',
    title: 'Streak 7',
    description: 'Latihan 7 hari beruntun.',
    category: 'streak',
    iconName: 'flame',
    evaluate: (aggr) => {
      const current = aggr.bestStreak;
      const target = 7;
      return { unlocked: current >= target, current, target, unit: 'hari' };
    }
  },
  {
    id: 'ach_streak_14',
    title: 'Streak 14',
    description: 'Latihan 14 hari beruntun.',
    category: 'streak',
    iconName: 'flame',
    evaluate: (aggr) => {
      const current = aggr.bestStreak;
      const target = 14;
      return { unlocked: current >= target, current, target, unit: 'hari' };
    }
  },
  {
    id: 'ach_streak_30',
    title: 'Streak 30',
    description: 'Latihan 30 hari beruntun.',
    category: 'streak',
    iconName: 'flame',
    evaluate: (aggr) => {
      const current = aggr.bestStreak;
      const target = 30;
      return { unlocked: current >= target, current, target, unit: 'hari' };
    }
  },

  // 3. Distance
  {
    id: 'ach_first_10k',
    title: 'First 10K',
    description: 'Total jarak tempuh mencapai 10 km.',
    category: 'distance',
    iconName: 'distance',
    evaluate: (aggr) => {
      const current = Number(aggr.totalDistance.toFixed(1));
      const target = 10;
      return { unlocked: current >= target, current, target, unit: 'km' };
    }
  },
  {
    id: 'ach_distance_50',
    title: 'Distance 50',
    description: 'Total jarak tempuh mencapai 50 km.',
    category: 'distance',
    iconName: 'distance',
    evaluate: (aggr) => {
      const current = Number(aggr.totalDistance.toFixed(1));
      const target = 50;
      return { unlocked: current >= target, current, target, unit: 'km' };
    }
  },
  {
    id: 'ach_distance_100',
    title: 'Distance 100',
    description: 'Total jarak tempuh mencapai 100 km.',
    category: 'distance',
    iconName: 'distance',
    evaluate: (aggr) => {
      const current = Number(aggr.totalDistance.toFixed(1));
      const target = 100;
      return { unlocked: current >= target, current, target, unit: 'km' };
    }
  },
  {
    id: 'ach_distance_250',
    title: 'Distance 250',
    description: 'Total jarak tempuh mencapai 250 km.',
    category: 'distance',
    iconName: 'distance',
    evaluate: (aggr) => {
      const current = Number(aggr.totalDistance.toFixed(1));
      const target = 250;
      return { unlocked: current >= target, current, target, unit: 'km' };
    }
  },
  {
    id: 'ach_distance_500',
    title: 'Distance 500',
    description: 'Total jarak tempuh mencapai 500 km.',
    category: 'distance',
    iconName: 'distance',
    evaluate: (aggr) => {
      const current = Number(aggr.totalDistance.toFixed(1));
      const target = 500;
      return { unlocked: current >= target, current, target, unit: 'km' };
    }
  },

  // 4. Single Session Distance
  {
    id: 'ach_long_hauler',
    title: 'Long Hauler',
    description: 'Selesaikan satu sesi latihan dengan jarak >= 15 km.',
    category: 'distance',
    iconName: 'distance',
    evaluate: (aggr) => {
      const current = Number(aggr.maxSingleDistance.toFixed(1));
      const target = 15;
      return { unlocked: current >= target, current, target, unit: 'km' };
    }
  },
  {
    id: 'ach_distance_pusher',
    title: 'Distance Pusher',
    description: 'Selesaikan satu sesi latihan dengan jarak >= 25 km.',
    category: 'distance',
    iconName: 'distance',
    evaluate: (aggr) => {
      const current = Number(aggr.maxSingleDistance.toFixed(1));
      const target = 25;
      return { unlocked: current >= target, current, target, unit: 'km' };
    }
  },

  // 5. Cycling
  {
    id: 'ach_first_ride',
    title: 'First Ride',
    description: 'Catat aktivitas Bersepeda pertama.',
    category: 'cycling',
    iconName: 'cycling',
    evaluate: (aggr) => {
      const current = aggr.byType.cycling.count;
      const target = 1;
      return { unlocked: current >= target, current, target, unit: 'sesi' };
    }
  },
  {
    id: 'ach_century_ride',
    title: 'Century Ride',
    description: 'Akumulasi jarak Bersepeda mencapai 100 km.',
    category: 'cycling',
    iconName: 'cycling',
    evaluate: (aggr) => {
      const current = Number(aggr.byType.cycling.distance.toFixed(1));
      const target = 100;
      return { unlocked: current >= target, current, target, unit: 'km' };
    }
  },
  {
    id: 'ach_road_warrior',
    title: 'Road Warrior',
    description: 'Akumulasi jarak Bersepeda mencapai 250 km.',
    category: 'cycling',
    iconName: 'cycling',
    evaluate: (aggr) => {
      const current = Number(aggr.byType.cycling.distance.toFixed(1));
      const target = 250;
      return { unlocked: current >= target, current, target, unit: 'km' };
    }
  },

  // 6. Running
  {
    id: 'ach_first_run',
    title: 'First Run',
    description: 'Catat aktivitas Lari pertama.',
    category: 'running',
    iconName: 'running',
    evaluate: (aggr) => {
      const current = aggr.byType.running.count;
      const target = 1;
      return { unlocked: current >= target, current, target, unit: 'sesi' };
    }
  },
  {
    id: 'ach_runner_50',
    title: 'Runner 50',
    description: 'Akumulasi jarak Lari mencapai 50 km.',
    category: 'running',
    iconName: 'running',
    evaluate: (aggr) => {
      const current = Number(aggr.byType.running.distance.toFixed(1));
      const target = 50;
      return { unlocked: current >= target, current, target, unit: 'km' };
    }
  },
  {
    id: 'ach_runner_100',
    title: 'Runner 100',
    description: 'Akumulasi jarak Lari mencapai 100 km.',
    category: 'running',
    iconName: 'running',
    evaluate: (aggr) => {
      const current = Number(aggr.byType.running.distance.toFixed(1));
      const target = 100;
      return { unlocked: current >= target, current, target, unit: 'km' };
    }
  },

  // 7. Walking
  {
    id: 'ach_first_walk',
    title: 'First Walk',
    description: 'Catat aktivitas Jalan Kaki pertama.',
    category: 'walking',
    iconName: 'walking',
    evaluate: (aggr) => {
      const current = aggr.byType.walking.count;
      const target = 1;
      return { unlocked: current >= target, current, target, unit: 'sesi' };
    }
  },
  {
    id: 'ach_walk_25',
    title: 'Walk 25',
    description: 'Akumulasi jarak Jalan Kaki mencapai 25 km.',
    category: 'walking',
    iconName: 'walking',
    evaluate: (aggr) => {
      const current = Number(aggr.byType.walking.distance.toFixed(1));
      const target = 25;
      return { unlocked: current >= target, current, target, unit: 'km' };
    }
  },
  {
    id: 'ach_walk_100',
    title: 'Walk 100',
    description: 'Akumulasi jarak Jalan Kaki mencapai 100 km.',
    category: 'walking',
    iconName: 'walking',
    evaluate: (aggr) => {
      const current = Number(aggr.byType.walking.distance.toFixed(1));
      const target = 100;
      return { unlocked: current >= target, current, target, unit: 'km' };
    }
  },

  // 8. Workout
  {
    id: 'ach_first_workout',
    title: 'First Workout',
    description: 'Catat aktivitas Workout pertama.',
    category: 'workout',
    iconName: 'workout',
    evaluate: (aggr) => {
      const current = aggr.byType.workout.count;
      const target = 1;
      return { unlocked: current >= target, current, target, unit: 'sesi' };
    }
  },
  {
    id: 'ach_workout_ten',
    title: 'Workout Ten',
    description: 'Selesaikan 10 sesi Workout.',
    category: 'workout',
    iconName: 'workout',
    evaluate: (aggr) => {
      const current = aggr.byType.workout.count;
      const target = 10;
      return { unlocked: current >= target, current, target, unit: 'sesi' };
    }
  },
  {
    id: 'ach_workout_25',
    title: 'Workout 25',
    description: 'Selesaikan 25 sesi Workout.',
    category: 'workout',
    iconName: 'workout',
    evaluate: (aggr) => {
      const current = aggr.byType.workout.count;
      const target = 25;
      return { unlocked: current >= target, current, target, unit: 'sesi' };
    }
  },

  // 9. Time
  {
    id: 'ach_active_300',
    title: 'Active 300',
    description: 'Akumulasi waktu aktif mencapai 300 menit.',
    category: 'time',
    iconName: 'duration',
    evaluate: (aggr) => {
      const current = aggr.totalMinutes;
      const target = 300;
      return { unlocked: current >= target, current, target, unit: 'menit' };
    }
  },
  {
    id: 'ach_active_1000',
    title: 'Active 1000',
    description: 'Akumulasi waktu aktif mencapai 1.000 menit.',
    category: 'time',
    iconName: 'duration',
    evaluate: (aggr) => {
      const current = aggr.totalMinutes;
      const target = 1000;
      return { unlocked: current >= target, current, target, unit: 'menit' };
    }
  },
  {
    id: 'ach_active_3000',
    title: 'Active 3000',
    description: 'Akumulasi waktu aktif mencapai 3.000 menit.',
    category: 'time',
    iconName: 'duration',
    evaluate: (aggr) => {
      const current = aggr.totalMinutes;
      const target = 3000;
      return { unlocked: current >= target, current, target, unit: 'menit' };
    }
  },
  {
    id: 'ach_endurance',
    title: 'Endurance',
    description: 'Selesaikan satu sesi latihan dengan durasi >= 90 menit.',
    category: 'time',
    iconName: 'duration',
    evaluate: (aggr) => {
      const current = aggr.maxSingleDuration;
      const target = 90;
      return { unlocked: current >= target, current, target, unit: 'menit' };
    }
  },

  // 10. Consistency
  {
    id: 'ach_weekly_win',
    title: 'Weekly Win',
    description: 'Capai seluruh 4 Weekly Goals dalam satu minggu.',
    category: 'consistency',
    iconName: 'target',
    evaluate: (aggr) => {
      const current = aggr.weeklyMetCount;
      const target = 4;
      return { unlocked: current >= target, current, target, unit: 'goals' };
    }
  },
  {
    id: 'ach_consistent_two',
    title: 'Consistent Two',
    description: 'Capai target sesi mingguan selama 2 minggu berbeda.',
    category: 'consistency',
    iconName: 'target',
    evaluate: (aggr) => {
      const current = aggr.weeksMetSessionTargetCount;
      const target = 2;
      return { unlocked: current >= target, current, target, unit: 'minggu' };
    }
  },
  {
    id: 'ach_consistency_master',
    title: 'Consistency Master',
    description: 'Capai target sesi mingguan selama 4 minggu berbeda.',
    category: 'consistency',
    iconName: 'target',
    evaluate: (aggr) => {
      const current = aggr.weeksMetSessionTargetCount;
      const target = 4;
      return { unlocked: current >= target, current, target, unit: 'minggu' };
    }
  },

  // 11. Time of Day
  {
    id: 'ach_sunrise_starter',
    title: 'Sunrise Starter',
    description: 'Selesaikan aktivitas pertama sebelum jam 07:00 pagi.',
    category: 'time_of_day',
    iconName: 'calendar',
    evaluate: (aggr) => {
      const current = aggr.earlyMorningSessions;
      const target = 1;
      return { unlocked: current >= target, current, target, unit: 'sesi' };
    }
  },
  {
    id: 'ach_early_bird',
    title: 'Early Bird',
    description: 'Selesaikan 10 sesi latihan sebelum jam 07:00 pagi.',
    category: 'time_of_day',
    iconName: 'calendar',
    evaluate: (aggr) => {
      const current = aggr.earlyMorningSessions;
      const target = 10;
      return { unlocked: current >= target, current, target, unit: 'sesi' };
    }
  },
  {
    id: 'ach_night_mover',
    title: 'Night Mover',
    description: 'Selesaikan 10 sesi latihan setelah jam 19:00 malam.',
    category: 'time_of_day',
    iconName: 'calendar',
    evaluate: (aggr) => {
      const current = aggr.nightSessions;
      const target = 10;
      return { unlocked: current >= target, current, target, unit: 'sesi' };
    }
  },

  // 12. All Rounder
  {
    id: 'ach_explorer',
    title: 'Explorer',
    description: 'Cobalah keempat jenis olahraga (Lari, Bersepeda, Jalan, Workout).',
    category: 'all_rounder',
    iconName: 'pulse',
    evaluate: (aggr) => {
      const sportsTried = Object.values(aggr.byType).filter(s => s.count >= 1).length;
      const target = 4;
      return { unlocked: sportsTried >= target, current: sportsTried, target, unit: 'cabang' };
    }
  },
  {
    id: 'ach_all_rounder',
    title: 'All Rounder',
    description: 'Selesaikan minimal 5 sesi pada setiap cabang olahraga.',
    category: 'all_rounder',
    iconName: 'pulse',
    evaluate: (aggr) => {
      const sportsMet = Object.values(aggr.byType).filter(s => s.count >= 5).length;
      const target = 4;
      return { unlocked: sportsMet >= target, current: sportsMet, target, unit: 'cabang' };
    }
  },
  {
    id: 'ach_balanced_athlete',
    title: 'Balanced Athlete',
    description: 'Selesaikan minimal 10 sesi pada setiap cabang olahraga.',
    category: 'all_rounder',
    iconName: 'pulse',
    evaluate: (aggr) => {
      const sportsMet = Object.values(aggr.byType).filter(s => s.count >= 10).length;
      const target = 4;
      return { unlocked: sportsMet >= target, current: sportsMet, target, unit: 'cabang' };
    }
  }
];

export function buildAchievementAggregates(activities, goals) {
  const streaks = StatisticsManager.calculateStreak(activities);

  const aggr = {
    totalSessions: activities.length,
    totalDistance: 0,
    totalMinutes: 0,
    totalCalories: 0,
    byType: {
      running: { count: 0, distance: 0, duration: 0 },
      cycling: { count: 0, distance: 0, duration: 0 },
      walking: { count: 0, distance: 0, duration: 0 },
      workout: { count: 0, distance: 0, duration: 0 }
    },
    maxSingleDistance: 0,
    maxSingleDuration: 0,
    earlyMorningSessions: 0,
    nightSessions: 0,
    bestStreak: streaks.bestStreak,
    currentStreak: streaks.currentStreak,
    weeklyMap: {}
  };

  activities.forEach(act => {
    const dist = Number(act.distance) || 0;
    const dur = Number(act.duration) || 0;
    const cal = Number(act.calories) || 0;

    aggr.totalDistance += dist;
    aggr.totalMinutes += dur;
    aggr.totalCalories += cal;

    if (act.type !== 'workout' && dist > aggr.maxSingleDistance) {
      aggr.maxSingleDistance = dist;
    }
    if (dur > aggr.maxSingleDuration) {
      aggr.maxSingleDuration = dur;
    }

    if (aggr.byType[act.type]) {
      aggr.byType[act.type].count += 1;
      aggr.byType[act.type].distance += dist;
      aggr.byType[act.type].duration += dur;
    }

    if (act.date) {
      const d = new Date(act.date);
      if (!isNaN(d.getTime())) {
        const hour = d.getHours();
        if (hour < 7) aggr.earlyMorningSessions += 1;
        if (hour >= 19) aggr.nightSessions += 1;

        const day = d.getDay();
        const diffToMon = d.getDate() - day + (day === 0 ? -6 : 1);
        const mon = new Date(d.getFullYear(), d.getMonth(), diffToMon);
        const weekKey = mon.toISOString().split('T')[0];

        if (!aggr.weeklyMap[weekKey]) {
          aggr.weeklyMap[weekKey] = { sessions: 0, minutes: 0, distance: 0, calories: 0 };
        }
        aggr.weeklyMap[weekKey].sessions += 1;
        aggr.weeklyMap[weekKey].minutes += dur;
        aggr.weeklyMap[weekKey].distance += dist;
        aggr.weeklyMap[weekKey].calories += cal;
      }
    }
  });

  let weeklyMetCount = 0;
  const targetActs = goals.targetActivities || 4;
  const targetMins = goals.targetMinutes || 150;
  const targetDist = goals.targetDistance || 20;
  const targetCals = goals.targetCalories || 1500;

  const now = new Date();
  const currDay = now.getDay();
  const currDiffToMon = now.getDate() - currDay + (currDay === 0 ? -6 : 1);
  const currMon = new Date(now.getFullYear(), now.getMonth(), currDiffToMon);
  const currWeekKey = currMon.toISOString().split('T')[0];

  const currentWeekData = aggr.weeklyMap[currWeekKey] || { sessions: 0, minutes: 0, distance: 0, calories: 0 };
  if (currentWeekData.distance >= targetDist) weeklyMetCount++;
  if (currentWeekData.minutes >= targetMins) weeklyMetCount++;
  if (currentWeekData.calories >= targetCals) weeklyMetCount++;
  if (currentWeekData.sessions >= targetActs) weeklyMetCount++;

  aggr.weeklyMetCount = weeklyMetCount;

  let weeksMetSessionTargetCount = 0;
  Object.values(aggr.weeklyMap).forEach(w => {
    if (w.sessions >= targetActs) weeksMetSessionTargetCount++;
  });
  aggr.weeksMetSessionTargetCount = weeksMetSessionTargetCount;

  return aggr;
}

export function evaluateAchievements(activities, goals) {
  const aggr = buildAchievementAggregates(activities, goals);
  const unlockedMap = StorageEngine.getUnlockedAchievements();
  const newlyUnlockedQueue = [];

  const results = ACHIEVEMENTS_DEFINITIONS.map(def => {
    const evalRes = def.evaluate(aggr);
    const wasUnlockedInMap = Boolean(unlockedMap[def.id]);
    const isUnlockedNow = evalRes.unlocked || wasUnlockedInMap;

    let state = 'locked';
    if (isUnlockedNow) {
      state = 'unlocked';
      if (!wasUnlockedInMap) {
        unlockedMap[def.id] = {
          unlockedAt: new Date().toISOString(),
          notified: false
        };
        newlyUnlockedQueue.push(def);
      }
    } else if (evalRes.current > 0) {
      state = 'in_progress';
    }

    const pct = Math.min(Math.round((evalRes.current / evalRes.target) * 100), 100);

    return {
      ...def,
      state,
      unlocked: isUnlockedNow,
      current: evalRes.current,
      target: evalRes.target,
      unit: evalRes.unit,
      progressPercentage: isUnlockedNow ? 100 : pct
    };
  });

  // Check for any un-notified unlocked items
  Object.keys(unlockedMap).forEach(id => {
    if (!unlockedMap[id].notified) {
      const def = ACHIEVEMENTS_DEFINITIONS.find(d => d.id === id);
      if (def && !newlyUnlockedQueue.some(q => q.id === id)) {
        newlyUnlockedQueue.push(def);
      }
    }
  });

  if (newlyUnlockedQueue.length > 0) {
    newlyUnlockedQueue.forEach(def => {
      DashboardController.showToast(`Pencapaian Baru: ${def.title}`, 'success');
      if (unlockedMap[def.id]) {
        unlockedMap[def.id].notified = true;
      }
    });
  }

  StorageEngine.saveUnlockedAchievements(unlockedMap);
  return results;
}

export const AchievementsController = {
  statusFilter: 'all',
  categoryFilter: 'all',

  init() {
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    const editGoalsBtn = $('#btn-edit-goals');
    const goalModalOverlay = $('#modal-goal-settings');
    const closeGoalModalBtn = $('#btn-close-goal-modal');
    const cancelGoalModalBtn = $('#btn-cancel-goal-modal');
    const goalForm = $('#form-weekly-goals');
    const statusPills = $$('.ach-pill');
    const categorySelect = $('#ach-category-select');

    if (editGoalsBtn) editGoalsBtn.addEventListener('click', () => this.openGoalModal());
    if (closeGoalModalBtn) closeGoalModalBtn.addEventListener('click', () => this.closeGoalModal());
    if (cancelGoalModalBtn) cancelGoalModalBtn.addEventListener('click', () => this.closeGoalModal());

    if (goalModalOverlay) {
      goalModalOverlay.addEventListener('click', (e) => {
        if (e.target === goalModalOverlay) this.closeGoalModal();
      });
    }

    if (goalForm) {
      goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleGoalSubmit();
      });
    }

    statusPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        this.statusFilter = e.currentTarget.dataset.filter;
        statusPills.forEach(p => {
          p.classList.toggle('active', p === e.currentTarget);
          p.setAttribute('aria-selected', p === e.currentTarget ? 'true' : 'false');
        });
        this.render();
      });
    });

    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => {
        this.categoryFilter = e.target.value;
        this.render();
      });
    }
  },

  openGoalModal() {
    const modal = $('#modal-goal-settings');
    const goals = StorageEngine.getWeeklyGoals();

    const inputDist = $('#goal-target-distance');
    const inputMins = $('#goal-target-minutes');
    const inputCals = $('#goal-target-calories');
    const inputActs = $('#goal-target-activities');

    if (inputDist) inputDist.value = goals.targetDistance;
    if (inputMins) inputMins.value = goals.targetMinutes;
    if (inputCals) inputCals.value = goals.targetCalories;
    if (inputActs) inputActs.value = goals.targetActivities;

    if (modal) modal.classList.add('active');
  },

  closeGoalModal() {
    const modal = $('#modal-goal-settings');
    if (modal) modal.classList.remove('active');
  },

  handleGoalSubmit() {
    const inputDist = $('#goal-target-distance');
    const inputMins = $('#goal-target-minutes');
    const inputCals = $('#goal-target-calories');
    const inputActs = $('#goal-target-activities');

    const newGoals = {
      targetDistance: Number(inputDist.value) || 20,
      targetMinutes: Number(inputMins.value) || 150,
      targetCalories: Number(inputCals.value) || 1500,
      targetActivities: Number(inputActs.value) || 4
    };

    StorageEngine.saveWeeklyGoals(newGoals);
    this.closeGoalModal();

    DashboardController.render();
    this.render();
    DashboardController.showToast('Target mingguan berhasil diperbarui.', 'success');
  },

  render() {
    const activities = ActivityManager.getAll();
    const goals = StorageEngine.getWeeklyGoals();
    const unit = StorageEngine.getUnits();
    const evaluatedList = evaluateAchievements(activities, goals);

    this.renderWeeklyGoalsCard(activities, goals, unit);
    this.renderAchievementsGrid(evaluatedList);
  },

  renderWeeklyGoalsCard(activities, goals, unit) {
    const container = $('#weekly-goals-container');
    if (!container) return;

    // Filter current week activities
    const currentWeekActs = activities.filter(act => {
      if (!act.date) return false;
      const d = new Date(act.date);
      if (isNaN(d.getTime())) return false;
      const now = new Date();
      const day = now.getDay();
      const diffToMon = now.getDate() - day + (day === 0 ? -6 : 1);
      const mon = new Date(now.getFullYear(), now.getMonth(), diffToMon, 0, 0, 0, 0);
      const sun = new Date(mon.getTime() + 7 * 86400000 - 1);
      return d >= mon && d <= sun;
    });

    let actDist = 0;
    let actMins = 0;
    let actCals = 0;
    let actCount = currentWeekActs.length;

    currentWeekActs.forEach(act => {
      actDist += Number(act.distance) || 0;
      actMins += Number(act.duration) || 0;
      actCals += Number(act.calories) || 0;
    });

    const targetDist = goals.targetDistance;
    const targetMins = goals.targetMinutes;
    const targetCals = goals.targetCalories;
    const targetActs = goals.targetActivities;

    const pctDist = Math.round((actDist / targetDist) * 100);
    const pctMins = Math.round((actMins / targetMins) * 100);
    const pctCals = Math.round((actCals / targetCals) * 100);
    const pctActs = Math.round((actCount / targetActs) * 100);

    const rawOverall = Math.round((pctDist + pctMins + pctCals + pctActs) / 4);
    const overallPct = Math.min(rawOverall, 100);

    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (overallPct / 100) * circumference;

    container.innerHTML = `
      <div class="weekly-goals-layout">
        <!-- Overall Progress Circular Ring -->
        <div class="weekly-overall-col">
          <div class="circular-progress-wrapper">
            <svg class="circular-ring-svg" viewBox="0 0 120 120">
              <circle class="ring-bg" cx="60" cy="60" r="54" />
              <circle class="ring-fill" cx="60" cy="60" r="54" style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${strokeDashoffset};" />
            </svg>
            <div class="ring-center-content">
              <span class="ring-pct-number">${overallPct}%</span>
              <span class="ring-label-text">Target Mingguan</span>
            </div>
          </div>
        </div>

        <!-- 4 Goals Bars Grid -->
        <div class="weekly-bars-grid">
          <!-- 1. Jarak -->
          <div class="goal-item-row">
            <div class="goal-item-header">
              <span class="goal-item-title">Jarak</span>
              <div class="goal-item-meta">
                <span>${formatDistance(actDist, unit)} dari ${formatDistance(targetDist, unit)}</span>
                ${actDist >= targetDist ? `<span class="goal-completed-tag">✓ Tercapai</span>` : ''}
              </div>
            </div>
            <div class="goal-progress-track">
              <div class="goal-progress-bar" style="width: ${Math.min(pctDist, 100)}%;"></div>
            </div>
          </div>

          <!-- 2. Menit Aktif -->
          <div class="goal-item-row">
            <div class="goal-item-header">
              <span class="goal-item-title">Menit Aktif</span>
              <div class="goal-item-meta">
                <span>${actMins} dari ${targetMins} menit</span>
                ${actMins >= targetMins ? `<span class="goal-completed-tag">✓ Tercapai</span>` : ''}
              </div>
            </div>
            <div class="goal-progress-track">
              <div class="goal-progress-bar" style="width: ${Math.min(pctMins, 100)}%;"></div>
            </div>
          </div>

          <!-- 3. Estimasi Kalori -->
          <div class="goal-item-row">
            <div class="goal-item-header">
              <span class="goal-item-title">Estimasi Kalori</span>
              <div class="goal-item-meta">
                <span>${actCals.toLocaleString('id-ID')} dari ${targetCals.toLocaleString('id-ID')} kcal</span>
                ${actCals >= targetCals ? `<span class="goal-completed-tag">✓ Tercapai</span>` : ''}
              </div>
            </div>
            <div class="goal-progress-track">
              <div class="goal-progress-bar" style="width: ${Math.min(pctCals, 100)}%;"></div>
            </div>
          </div>

          <!-- 4. Sesi -->
          <div class="goal-item-row">
            <div class="goal-item-header">
              <span class="goal-item-title">Sesi</span>
              <div class="goal-item-meta">
                <span>${actCount} dari ${targetActs} sesi</span>
                ${actCount >= targetActs ? `<span class="goal-completed-tag">✓ Tercapai</span>` : ''}
              </div>
            </div>
            <div class="goal-progress-track">
              <div class="goal-progress-bar" style="width: ${Math.min(pctActs, 100)}%;"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderAchievementsGrid(list) {
    const container = $('#achievements-grid-container');
    if (!container) return;

    let filtered = [...list];

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(a => a.state === this.statusFilter);
    }

    if (this.categoryFilter !== 'all') {
      filtered = filtered.filter(a => a.category === this.categoryFilter);
    }

    // Sort: Unlocked first, then in-progress (highest progress %), then locked
    filtered.sort((a, b) => {
      const order = { unlocked: 1, in_progress: 2, locked: 3 };
      if (order[a.state] !== order[b.state]) {
        return order[a.state] - order[b.state];
      }
      return b.progressPercentage - a.progressPercentage;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">${Icons.trophy('icon-xl')}</div>
          <h3 class="empty-title">Tidak ada pencapaian dalam kategori ini.</h3>
          <p class="empty-desc">Coba ubah status filter atau pilih kategori pencapaian lain.</p>
        </div>
      `;
      return;
    }

    const getSvgIcon = (iconName) => {
      if (typeof Icons[iconName] === 'function') {
        return Icons[iconName]('icon-lg');
      }
      return Icons.trophy('icon-lg');
    };

    container.innerHTML = filtered.map(ach => {
      const isUnlocked = ach.state === 'unlocked';
      const isInProgress = ach.state === 'in_progress';

      let statusBadgeText = 'TERKUNCI';
      let statusBadgeClass = 'locked';
      if (isUnlocked) {
        statusBadgeText = 'TERBUKA';
        statusBadgeClass = 'unlocked';
      } else if (isInProgress) {
        statusBadgeText = 'DALAM PROGRES';
        statusBadgeClass = 'in-progress';
      }

      return `
        <article class="achievement-card ${ach.state}" data-id="${ach.id}">
          <div class="ach-icon-box ${ach.state}">
            ${getSvgIcon(ach.iconName)}
          </div>
          <div class="ach-card-body">
            <div class="ach-title-row">
              <h3 class="ach-title">${ach.title}</h3>
              <span class="ach-status-badge ${statusBadgeClass}">${statusBadgeText}</span>
            </div>
            <p class="ach-description">${ach.description}</p>
            
            <div class="ach-progress-block">
              <div class="ach-progress-labels">
                <span class="ach-progress-val">${isUnlocked ? 'Selesai' : `${ach.current} / ${ach.target} ${ach.unit}`}</span>
                <span class="ach-progress-pct">${ach.progressPercentage}%</span>
              </div>
              <div class="ach-track">
                <div class="ach-bar ${ach.state}" style="width: ${ach.progressPercentage}%;"></div>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
};

