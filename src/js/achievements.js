/**
 * HabitPulse Achievements & Goal Controller
 */
import { ActivityManager } from './activities.js';
import { StatisticsManager } from './statistics.js';
import { StorageEngine } from './storage.js';
import { DashboardController } from './dashboard.js';
import { $, $$ } from './utils.js';

export const AchievementsController = {
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

    if (editGoalsBtn) {
      editGoalsBtn.addEventListener('click', () => this.openGoalModal());
    }

    if (closeGoalModalBtn) {
      closeGoalModalBtn.addEventListener('click', () => this.closeGoalModal());
    }

    if (cancelGoalModalBtn) {
      cancelGoalModalBtn.addEventListener('click', () => this.closeGoalModal());
    }

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
  },

  openGoalModal() {
    const modal = $('#modal-goal-settings');
    const goals = StorageEngine.getWeeklyGoals();

    const inputActs = $('#goal-target-activities');
    const inputMins = $('#goal-target-minutes');
    const inputDist = $('#goal-target-distance');

    if (inputActs) inputActs.value = goals.targetActivities;
    if (inputMins) inputMins.value = goals.targetMinutes;
    if (inputDist) inputDist.value = goals.targetDistance;

    if (modal) modal.classList.add('active');
  },

  closeGoalModal() {
    const modal = $('#modal-goal-settings');
    if (modal) modal.classList.remove('active');
  },

  handleGoalSubmit() {
    const inputActs = $('#goal-target-activities');
    const inputMins = $('#goal-target-minutes');
    const inputDist = $('#goal-target-distance');

    const newGoals = {
      targetActivities: Number(inputActs.value) || 5,
      targetMinutes: Number(inputMins.value) || 150,
      targetDistance: Number(inputDist.value) || 20
    };

    StorageEngine.saveWeeklyGoals(newGoals);
    this.closeGoalModal();

    // Re-render dashboard & achievements
    DashboardController.render();
    this.render();
    DashboardController.showToast('Weekly goals updated successfully', 'success');
  },

  render() {
    const activities = ActivityManager.getAll();
    const stats = StatisticsManager.calculateOverview(activities);

    // 1. Render Motivational Banner
    const bannerContainer = $('#motivational-banner-container');
    if (bannerContainer) {
      bannerContainer.innerHTML = `
        <div class="motivational-banner">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 40px; height: 40px; border-radius: var(--radius-full); background: rgba(22, 163, 74, 0.15); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              ⚡
            </div>
            <div>
              <strong style="display: block; font-size: 0.95rem; color: var(--text-primary); font-weight: 800;">${stats.motivationalMessage}</strong>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">Keep pushing your boundaries every single day.</span>
            </div>
          </div>
          <div class="streak-badge-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--secondary);"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5Z"/></svg>
            <span>${stats.currentStreak} Day Streak</span>
          </div>
        </div>
      `;
    }

    // 2. Render Achievements Grid
    const achievementsContainer = $('#achievements-grid-container');
    if (achievementsContainer) {
      achievementsContainer.innerHTML = stats.achievements.map(ach => `
        <div class="achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon-box">
            ${ach.icon}
          </div>
          <div class="achievement-content">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary);">${ach.title}</h4>
              <span class="achievement-badge ${ach.unlocked ? 'unlocked' : 'locked'}">
                ${ach.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">${ach.description}</p>
            <div style="font-size: 0.72rem; font-weight: 700; color: var(--primary); margin-top: 0.5rem;">
              ${ach.progressText}
            </div>
          </div>
        </div>
      `).join('');
    }
  }
};
