/**
 * HabitPulse Dashboard & UI Controller
 */
import { ActivityManager } from './activities.js';
import { StatisticsManager } from './statistics.js';
import { Validator } from './validation.js';
import { StorageEngine } from './storage.js';
import { $, $$, formatDate, formatDuration, formatDistance, calculatePace, escapeHTML, getGreetingByTime, estimateCalories } from './utils.js';
import { Icons } from './icons.js';
import { AnalyticsController } from './analytics.js';
import { HistoryController } from './history.js';
import { AchievementsController } from './achievements.js';

export const DashboardController = {
  currentFilter: 'all',
  targetDeleteId: null,
  isUserCaloriesTouched: false,

  init() {
    ActivityManager.init();
    this.bindEvents();
    this.bindNavigation();
    this.renderStaticIcons();
    this.handleInitialTab();
    this.render();
  },

  renderStaticIcons() {
    // Top Bar & Modal Icons
    const iconDist = $('#icon-stat-distance');
    const iconDur = $('#icon-stat-duration');
    const iconCal = $('#icon-stat-calories');
    const iconCnt = $('#icon-stat-count');
    const topIconBtnAdd = $('#top-icon-btn-add');
    const iconBtnAdd = $('#icon-btn-add');
    const iconCloseModal = $('#btn-close-modal');

    if (iconDist) iconDist.innerHTML = Icons.distance('icon-md');
    if (iconDur) iconDur.innerHTML = Icons.duration('icon-md');
    if (iconCal) iconCal.innerHTML = Icons.calories('icon-md');
    if (iconCnt) iconCnt.innerHTML = Icons.trophy('icon-md');
    if (topIconBtnAdd) topIconBtnAdd.innerHTML = Icons.plus('icon-sm');
    if (iconBtnAdd) iconBtnAdd.innerHTML = Icons.plus('icon-sm');
    if (iconCloseModal) iconCloseModal.innerHTML = Icons.close('icon-md');

    // Sidebar Icons
    const sbOverview = $('#sidebar-icon-overview');
    const sbHistory = $('#sidebar-icon-history');
    const sbStats = $('#sidebar-icon-statistics');
    const sbAchieve = $('#sidebar-icon-achievements');
    const sbSettings = $('#sidebar-icon-settings');
    const sbStreak = $('#sidebar-streak-flame');

    if (sbOverview) sbOverview.innerHTML = Icons.dashboard('icon-md');
    if (sbHistory) sbHistory.innerHTML = Icons.activities('icon-md');
    if (sbStats) sbStats.innerHTML = Icons.statistics('icon-md');
    if (sbAchieve) sbAchieve.innerHTML = Icons.target('icon-md');
    if (sbSettings) sbSettings.innerHTML = Icons.settings('icon-md');
    if (sbStreak) sbStreak.innerHTML = Icons.flame('icon-md');

    // Mobile Bottom Nav Icons
    const mobOverview = $('#mobile-icon-overview');
    const mobHistory = $('#mobile-icon-history');
    const mobStats = $('#mobile-icon-statistics');
    const mobAchieve = $('#mobile-icon-achievements');
    const mobSettings = $('#mobile-icon-settings');
    const mobFab = $('#mobile-fab-icon');

    if (mobOverview) mobOverview.innerHTML = Icons.dashboard('icon-md');
    if (mobHistory) mobHistory.innerHTML = Icons.activities('icon-md');
    if (mobStats) mobStats.innerHTML = Icons.statistics('icon-md');
    if (mobAchieve) mobAchieve.innerHTML = Icons.target('icon-md');
    if (mobSettings) mobSettings.innerHTML = Icons.settings('icon-md');
    if (mobFab) mobFab.innerHTML = Icons.plus('icon-lg');
  },

  bindNavigation() {
    const navLinks = $$('.sidebar-link, .mobile-bottom-item, .nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const tab = link.dataset.tab;
        if (tab) {
          e.preventDefault();
          this.switchTab(tab);
        }
      });
    });

    window.addEventListener('hashchange', () => {
      this.handleInitialTab();
    });
  },

  handleInitialTab() {
    const hash = window.location.hash.replace('#', '');
    const tabMap = {
      'dashboard-overview': 'overview',
      'overview': 'overview',
      'history': 'history',
      'statistics': 'statistics',
      'achievements': 'achievements',
      'settings': 'settings'
    };

    const targetTab = tabMap[hash] || 'overview';
    this.switchTab(targetTab, false);
  },

  switchTab(tabKey, updateHash = true) {
    const tabMap = {
      overview: 'dashboard-overview',
      history: 'history',
      statistics: 'statistics',
      achievements: 'achievements',
      settings: 'settings'
    };

    const targetId = tabMap[tabKey] || 'dashboard-overview';

    // Toggle active link styles in sidebar and bottom navigation
    $$('.sidebar-link, .mobile-bottom-item').forEach(el => {
      if (el.dataset.tab === tabKey) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Toggle tab content visibility
    $$('.dashboard-tab-content, section.history-section, section#statistics, section#achievements, section#settings').forEach(sec => {
      if (sec.id === targetId || (targetId === 'dashboard-overview' && sec.id === 'dashboard-overview')) {
        sec.style.display = 'block';
        sec.classList.add('active');
      } else {
        sec.style.display = 'none';
        sec.classList.remove('active');
      }
    });

    if (updateHash) {
      history.pushState(null, '', `#${targetId}`);
    }

    // Trigger tab-specific renders
    if (tabKey === 'statistics' && AnalyticsController && typeof AnalyticsController.render === 'function') {
      AnalyticsController.render();
    } else if (tabKey === 'history' && HistoryController && typeof HistoryController.render === 'function') {
      HistoryController.render();
    } else if (tabKey === 'achievements' && AchievementsController && typeof AchievementsController.render === 'function') {
      AchievementsController.render();
    }
  },

  bindEvents() {
    const openModalBtns = $$('.btn-trigger-modal');
    const closeModalBtn = $('#btn-close-modal');
    const cancelModalBtn = $('#btn-cancel-modal');
    const modalOverlay = $('#modal-activity');
    const activityForm = $('#form-activity');
    const activityTypeSelect = $('#activity-type');
    const durationInput = $('#activity-duration');
    const distanceInput = $('#activity-distance');
    const intensitySelect = $('#activity-intensity');
    const caloriesInput = $('#activity-calories');

    const deleteModalOverlay = $('#modal-delete-confirm');
    const closeDeleteBtn = $('#btn-close-delete-modal');
    const cancelDeleteBtn = $('#btn-cancel-delete');
    const confirmDeleteBtn = $('#btn-confirm-delete');

    openModalBtns.forEach(btn => {
      btn.addEventListener('click', () => this.openActivityModal());
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', () => this.closeActivityModal());
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', () => this.closeActivityModal());

    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) this.closeActivityModal();
      });
    }

    if (activityTypeSelect) {
      activityTypeSelect.addEventListener('change', (e) => {
        const distanceGroup = $('#group-distance');
        if (distanceGroup) {
          if (e.target.value === 'workout') {
            distanceGroup.style.display = 'none';
            if (distanceInput) distanceInput.value = '0';
          } else {
            distanceGroup.style.display = 'flex';
          }
        }
        this.recalculateEstimatedCalories();
      });
    }

    if (durationInput) durationInput.addEventListener('input', () => this.recalculateEstimatedCalories());
    if (distanceInput) distanceInput.addEventListener('input', () => this.recalculateEstimatedCalories());
    if (intensitySelect) intensitySelect.addEventListener('change', () => this.recalculateEstimatedCalories());
    if (caloriesInput) {
      caloriesInput.addEventListener('input', () => {
        this.isUserCaloriesTouched = true;
      });
    }

    if (activityForm) {
      activityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }

    if (closeDeleteBtn) closeDeleteBtn.addEventListener('click', () => this.closeDeleteModal());
    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => this.closeDeleteModal());
    if (deleteModalOverlay) {
      deleteModalOverlay.addEventListener('click', (e) => {
        if (e.target === deleteModalOverlay) this.closeDeleteModal();
      });
    }
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', () => this.executeDeleteActivity());
    }

    const filterTabs = $$('.filter-tab');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const filter = e.currentTarget.dataset.filter;
        this.setFilter(filter);
      });
    });

    const activitiesContainer = $('#activities-container');
    if (activitiesContainer) {
      activitiesContainer.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.btn-edit-activity');
        const deleteBtn = e.target.closest('.btn-delete-activity');

        if (editBtn) {
          const activityId = editBtn.dataset.id;
          this.openEditActivityModal(activityId);
        } else if (deleteBtn) {
          const activityId = deleteBtn.dataset.id;
          this.openDeleteModal(activityId);
        }
      });
    }
  },

  recalculateEstimatedCalories() {
    if (this.isUserCaloriesTouched) return;

    const type = $('#activity-type') ? $('#activity-type').value : 'running';
    const duration = $('#activity-duration') ? $('#activity-duration').value : 0;
    const distance = $('#activity-distance') ? $('#activity-distance').value : 0;
    const intensity = $('#activity-intensity') ? $('#activity-intensity').value : 'moderate';

    const est = estimateCalories(type, duration, distance, intensity);
    const caloriesInput = $('#activity-calories');
    if (caloriesInput && est > 0) {
      caloriesInput.value = est.toString();
    }
  },

  setFilter(filterType) {
    this.currentFilter = filterType;
    $$('.filter-tab').forEach(tab => {
      if (tab.dataset.filter === filterType) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    this.renderRecentActivities();
  },

  openActivityModal() {
    const modal = $('#modal-activity');
    const form = $('#form-activity');
    const titleEl = $('#modal-title');
    const submitBtn = $('#btn-submit-form');
    const idInput = $('#activity-id');

    if (form) form.reset();
    if (idInput) idInput.value = '';
    if (titleEl) titleEl.textContent = 'Catat Aktivitas Baru';
    if (submitBtn) submitBtn.textContent = 'Simpan Aktivitas';
    this.isUserCaloriesTouched = false;

    const dateInput = $('#activity-date');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    const distanceGroup = $('#group-distance');
    if (distanceGroup) distanceGroup.style.display = 'flex';

    this.clearFormErrors();
    if (modal) modal.classList.add('active');
  },

  openEditActivityModal(id) {
    const activity = ActivityManager.getById(id);
    if (!activity) return;

    const modal = $('#modal-activity');
    const titleEl = $('#modal-title');
    const submitBtn = $('#btn-submit-form');

    if (titleEl) titleEl.textContent = 'Edit Aktivitas';
    if (submitBtn) submitBtn.textContent = 'Perbarui Aktivitas';

    $('#activity-id').value = activity.id;
    $('#activity-type').value = activity.type;
    $('#activity-title').value = activity.title;
    $('#activity-date').value = activity.date;
    $('#activity-duration').value = activity.duration;
    $('#activity-distance').value = activity.distance || 0;
    $('#activity-intensity').value = activity.intensity || 'moderate';
    $('#activity-calories').value = activity.calories || 0;
    $('#activity-notes').value = activity.notes || '';

    this.isUserCaloriesTouched = true;

    const distanceGroup = $('#group-distance');
    if (distanceGroup) {
      distanceGroup.style.display = activity.type === 'workout' ? 'none' : 'flex';
    }

    this.clearFormErrors();
    if (modal) modal.classList.add('active');
  },

  closeActivityModal() {
    const modal = $('#modal-activity');
    if (modal) modal.classList.remove('active');
    this.clearFormErrors();
  },

  openDeleteModal(id) {
    this.targetDeleteId = id;
    const deleteModal = $('#modal-delete-confirm');
    if (deleteModal) deleteModal.classList.add('active');
  },

  closeDeleteModal() {
    this.targetDeleteId = null;
    const deleteModal = $('#modal-delete-confirm');
    if (deleteModal) deleteModal.classList.remove('active');
  },

  executeDeleteActivity() {
    if (!this.targetDeleteId) return;

    const deleted = ActivityManager.delete(this.targetDeleteId);
    this.closeDeleteModal();

    if (deleted) {
      this.render();
      this.showToast('Activity deleted', 'error');
    }
  },

  clearFormErrors() {
    $$('.form-group').forEach(group => group.classList.remove('has-error'));
  },

  showFormErrors(errors) {
    this.clearFormErrors();
    Object.keys(errors).forEach(field => {
      const group = $(`#group-${field}`);
      const errorText = $(`#error-${field}`);
      if (group) group.classList.add('has-error');
      if (errorText) errorText.textContent = errors[field];
    });
  },

  handleFormSubmit() {
    const editId = $('#activity-id').value;

    const formData = {
      type: $('#activity-type').value,
      title: $('#activity-title').value,
      date: $('#activity-date').value,
      duration: $('#activity-duration').value,
      distance: $('#activity-type').value === 'workout' ? 0 : $('#activity-distance').value,
      intensity: $('#activity-intensity').value,
      calories: $('#activity-calories').value,
      notes: $('#activity-notes').value
    };

    const validation = Validator.validateActivity(formData);

    if (!validation.isValid) {
      this.showFormErrors(validation.errors);
      return;
    }

    if (editId) {
      ActivityManager.update(editId, formData);
      this.closeActivityModal();
      this.render();
      this.showToast('Activity updated', 'success');
    } else {
      ActivityManager.add(formData);
      this.closeActivityModal();
      this.render();
      this.showToast('Activity added', 'success');
    }
  },

  render() {
    this.renderGreeting();
    this.renderStats();
    this.renderDailyDistanceChart();
    this.renderMinutesPerDayChart();
    this.renderRecentActivities();
    
    if (AnalyticsController && typeof AnalyticsController.render === 'function') {
      AnalyticsController.render();
    }
    if (HistoryController && typeof HistoryController.render === 'function') {
      HistoryController.render();
    }
    if (AchievementsController && typeof AchievementsController.render === 'function') {
      AchievementsController.render();
    }
  },

  renderGreeting() {
    const greetingEl = $('#dashboard-greeting-title');
    if (greetingEl) {
      const greeting = getGreetingByTime();
      greetingEl.textContent = `${greeting}, Athlete!`;
    }
  },

  renderStats() {
    const allActivities = ActivityManager.getAll();
    const stats = StatisticsManager.calculateOverview(allActivities);
    const unit = StorageEngine.getUnits();

    // 4 Primary Summary Cards
    const elTotalDistance = $('#stat-total-distance');
    const elTotalDuration = $('#stat-total-duration');
    const elTotalCalories = $('#stat-total-calories');
    const elTotalCount = $('#stat-total-count');

    if (elTotalDistance) elTotalDistance.textContent = formatDistance(stats.weekly.totalDistanceKm, unit);
    if (elTotalDuration) elTotalDuration.textContent = formatDuration(stats.weekly.totalDurationMins);
    if (elTotalCalories) elTotalCalories.textContent = `${stats.weekly.totalCalories.toLocaleString()} kcal`;
    if (elTotalCount) elTotalCount.textContent = `${stats.weekly.activitiesCount} sesi`;

    // Sidebar Current Streak
    const elSidebarStreak = $('#sidebar-streak-days');
    if (elSidebarStreak) elSidebarStreak.textContent = `${stats.currentStreak} hari`;

    // Weekly Target Donut & Progress Bars
    const targetDistFormatted = unit === 'miles' ? (stats.weekly.targetDistance * 0.621371).toFixed(1) + ' mi' : stats.weekly.targetDistance + ' km';
    const currentDistFormatted = formatDistance(stats.weekly.totalDistanceKm, unit);

    const elTargetMainVal = $('#target-main-value');
    const elTargetMainTotal = $('#target-main-total');
    if (elTargetMainVal) elTargetMainVal.textContent = (stats.weekly.totalDistanceKm || 0).toFixed(1);
    if (elTargetMainTotal) elTargetMainTotal.textContent = `dari ${targetDistFormatted}`;

    // Donut SVG Circle Offset calculation
    const donutCircle = $('#donut-progress-circle');
    if (donutCircle) {
      const circumference = 251.2; // 2 * PI * 40
      const distPct = Math.min(stats.weekly.distancePct, 100);
      const offset = circumference - (distPct / 100) * circumference;
      donutCircle.style.strokeDashoffset = offset.toString();
    }

    // Weekly Sub progress bars (Visually capped at 100% max using Math.min)
    const elGoalNumber = $('#weekly-goal-number');
    const elGoalFill = $('#weekly-goal-fill');
    if (elGoalNumber) elGoalNumber.textContent = `${stats.weekly.activitiesCount} / ${stats.weekly.targetActivities}`;
    if (elGoalFill) elGoalFill.style.width = `${Math.min(stats.weekly.activitiesPct, 100)}%`;

    const elMinGoalNumber = $('#goal-mins-number');
    const elMinGoalFill = $('#goal-mins-fill');
    if (elMinGoalNumber) elMinGoalNumber.textContent = `${stats.weekly.totalDurationMins} / ${stats.weekly.targetMinutes}`;
    if (elMinGoalFill) elMinGoalFill.style.width = `${Math.min(stats.weekly.minutesPct, 100)}%`;

    const elDistGoalNumber = $('#goal-dist-number');
    const elDistGoalFill = $('#goal-dist-fill');
    if (elDistGoalNumber) elDistGoalNumber.textContent = `${currentDistFormatted} / ${targetDistFormatted}`;
    if (elDistGoalFill) elDistGoalFill.style.width = `${Math.min(stats.weekly.distancePct, 100)}%`;
  },

  /**
   * Render 7-day Daily Distance SVG Line/Bar Chart
   */
  renderDailyDistanceChart() {
    const container = $('#daily-distance-chart-wrapper');
    if (!container) return;

    const activities = ActivityManager.getAll();
    const unit = StorageEngine.getUnits();

    // Compute distance per day for last 7 days (today back to 6 days ago)
    const last7Days = [];
    const now = new Date();
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];
      last7Days.push({ dateStr, dayName, distanceKm: 0 });
    }

    activities.forEach(act => {
      if (!act.date) return;
      const actDate = act.date.split('T')[0];
      const item = last7Days.find(d => d.dateStr === actDate);
      if (item) {
        item.distanceKm += (Number(act.distance) || 0);
      }
    });

    const maxDist = Math.max(...last7Days.map(d => d.distanceKm), 10);

    container.innerHTML = `
      <div style="width: 100%; height: 180px; display: flex; align-items: flex-end; justify-content: space-between; gap: 0.75rem; padding-top: 1.5rem; border-bottom: 1px solid var(--color-border); position: relative;">
        ${last7Days.map(item => {
          const formatted = unit === 'miles' ? (item.distanceKm * 0.621371).toFixed(1) + ' mi' : item.distanceKm.toFixed(1) + ' km';
          const heightPct = Math.round((item.distanceKm / maxDist) * 100);

          return `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; position: relative;" title="${item.dayName}: ${formatted}">
              ${item.distanceKm > 0 ? `<span style="font-size: 0.68rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.35rem;">${item.distanceKm.toFixed(1)}</span>` : ''}
              <div style="width: 100%; max-width: 28px; height: ${Math.max(heightPct, item.distanceKm > 0 ? 8 : 4)}%; background: ${item.distanceKm > 0 ? 'linear-gradient(180deg, #7CE424 0%, rgba(124,228,36,0.2) 100%)' : 'rgba(255,255,255,0.05)'}; border-radius: var(--radius-sm); transition: height 0.5s ease;"></div>
              <span style="font-size: 0.75rem; font-weight: 600; color: var(--color-text-secondary); margin-top: 0.5rem;">${item.dayName}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  /**
   * Render 7-day Minutes Per Day SVG Bar Chart
   */
  renderMinutesPerDayChart() {
    const container = $('#minutes-per-day-chart-wrapper');
    if (!container) return;

    const activities = ActivityManager.getAll();

    const last7Days = [];
    const now = new Date();
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];
      last7Days.push({ dateStr, dayName, durationMins: 0 });
    }

    activities.forEach(act => {
      if (!act.date) return;
      const actDate = act.date.split('T')[0];
      const item = last7Days.find(d => d.dateStr === actDate);
      if (item) {
        item.durationMins += (Number(act.duration) || 0);
      }
    });

    const maxMins = Math.max(...last7Days.map(d => d.durationMins), 60);

    container.innerHTML = `
      <div style="width: 100%; height: 180px; display: flex; align-items: flex-end; justify-content: space-between; gap: 0.5rem; padding-top: 1.5rem; border-bottom: 1px solid var(--color-border); position: relative;">
        ${last7Days.map(item => {
          const heightPct = Math.round((item.durationMins / maxMins) * 100);

          return `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end;" title="${item.dayName}: ${item.durationMins}m">
              ${item.durationMins > 0 ? `<span style="font-size: 0.68rem; font-weight: 700; color: #38BDF8; margin-bottom: 0.35rem;">${item.durationMins}m</span>` : ''}
              <div style="width: 100%; max-width: 24px; height: ${Math.max(heightPct, item.durationMins > 0 ? 8 : 4)}%; background: ${item.durationMins > 0 ? 'linear-gradient(180deg, #38BDF8 0%, rgba(56,189,248,0.2) 100%)' : 'rgba(255,255,255,0.05)'}; border-radius: var(--radius-sm); transition: height 0.5s ease;"></div>
              <span style="font-size: 0.75rem; font-weight: 600; color: var(--color-text-secondary); margin-top: 0.5rem;">${item.dayName}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  renderRecentActivities() {
    const container = $('#activities-container');
    if (!container) return;

    const activities = ActivityManager.getFiltered(this.currentFilter);
    const unit = StorageEngine.getUnits();

    if (activities.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${Icons.pulse('icon-xl')}</div>
          <h3 class="empty-title">Belum ada aktivitas</h3>
          <p class="empty-desc">Catat aktivitas pertamamu untuk mulai melihat progres kinerjamu.</p>
          <button class="btn btn-primary btn-trigger-modal">
            ${Icons.plus('icon-sm')} Catat Aktivitas
          </button>
        </div>
      `;

      const emptyBtn = container.querySelector('.btn-trigger-modal');
      if (emptyBtn) {
        emptyBtn.addEventListener('click', () => this.openActivityModal());
      }
      return;
    }

    const typeIcons = {
      running: Icons.running('icon-md'),
      cycling: Icons.cycling('icon-md'),
      walking: Icons.walking('icon-md'),
      workout: Icons.workout('icon-md')
    };

    const typeNames = {
      running: 'Lari',
      cycling: 'Bersepeda',
      walking: 'Jalan Kaki',
      workout: 'Workout'
    };

    // Limit to maximum 5 recent activities for dashboard view
    const recentList = activities.slice(0, 5);

    container.innerHTML = recentList.map(act => {
      const icon = typeIcons[act.type] || Icons.pulse('icon-md');
      const typeName = typeNames[act.type] || act.type;

      return `
        <article class="activity-row" data-id="${act.id}">
          <div class="activity-row-main">
            <div class="activity-row-icon ${act.type}">
              ${icon}
            </div>
            <div class="activity-row-info">
              <h4>${escapeHTML(act.title)}</h4>
              <div class="activity-row-meta">
                <span>${typeName}</span> · <span>${formatDate(act.date)}</span>
              </div>
            </div>
          </div>

          <div class="activity-row-metrics">
            ${act.distance > 0 ? `
              <div class="activity-row-stat">
                <strong>${formatDistance(act.distance, unit)}</strong>
                <span>Jarak</span>
              </div>
            ` : ''}

            <div class="activity-row-stat">
              <strong>${formatDuration(act.duration)}</strong>
              <span>Durasi</span>
            </div>

            ${act.calories > 0 ? `
              <div class="activity-row-stat">
                <strong>${act.calories} kcal</strong>
                <span>Kalori</span>
              </div>
            ` : ''}

            <div class="activity-row-actions">
              <button class="btn-icon btn-edit-activity" data-id="${act.id}" title="Edit Aktivitas" aria-label="Edit Aktivitas">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </button>
              <button class="btn-icon btn-delete-activity" data-id="${act.id}" title="Hapus Aktivitas" aria-label="Hapus Aktivitas">
                ${Icons.trash('icon-sm')}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  },

  showToast(message, type = 'success') {
    const container = $('#toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? Icons.check('icon-md') : Icons.trash('icon-md');

    toast.innerHTML = `
      <span>${icon}</span>
      <span>${escapeHTML(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};
