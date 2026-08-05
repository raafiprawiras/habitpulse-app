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
    this.renderStaticIcons();
    this.render();
  },

  renderStaticIcons() {
    const iconDist = $('#icon-stat-distance');
    const iconDur = $('#icon-stat-duration');
    const iconCal = $('#icon-stat-calories');
    const iconCnt = $('#icon-stat-count');
    const iconHeroPulse = $('#icon-hero-pulse');
    const iconBtnAdd = $('#icon-btn-add');
    const iconCloseModal = $('#btn-close-modal');

    if (iconDist) iconDist.innerHTML = Icons.distance('icon-lg');
    if (iconDur) iconDur.innerHTML = Icons.duration('icon-lg');
    if (iconCal) iconCal.innerHTML = Icons.calories('icon-lg');
    if (iconCnt) iconCnt.innerHTML = Icons.trophy('icon-lg');
    if (iconHeroPulse) iconHeroPulse.innerHTML = Icons.pulse('icon-sm');
    if (iconBtnAdd) iconBtnAdd.innerHTML = Icons.plus('icon-sm');
    if (iconCloseModal) iconCloseModal.innerHTML = Icons.close('icon-md');

    const iconRunBd = $('#icon-breakdown-running');
    const iconCycBd = $('#icon-breakdown-cycling');
    const iconWalkBd = $('#icon-breakdown-walking');
    const iconWorkBd = $('#icon-breakdown-workout');

    if (iconRunBd) iconRunBd.innerHTML = Icons.running('icon-md');
    if (iconCycBd) iconCycBd.innerHTML = Icons.cycling('icon-md');
    if (iconWalkBd) iconWalkBd.innerHTML = Icons.walking('icon-md');
    if (iconWorkBd) iconWorkBd.innerHTML = Icons.workout('icon-md');
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
    this.renderActivityList();
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
    this.renderActivityList();
    
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

    const elTotalDistance = $('#stat-total-distance');
    const elTotalDuration = $('#stat-total-duration');
    const elTotalCalories = $('#stat-total-calories');
    const elTotalCount = $('#stat-total-count');

    if (elTotalDistance) elTotalDistance.textContent = formatDistance(stats.totalDistanceKm, unit);
    if (elTotalDuration) elTotalDuration.textContent = formatDuration(stats.totalDurationMins);
    if (elTotalCalories) elTotalCalories.textContent = `${stats.totalCalories.toLocaleString()} kcal`;
    if (elTotalCount) elTotalCount.textContent = stats.totalActivities.toString();

    const elGoalNumber = $('#weekly-goal-number');
    const elGoalSubtext = $('#weekly-goal-subtext');
    const elGoalFill = $('#weekly-goal-fill');
    const elGoalBadge = $('#weekly-goal-badge');

    if (elGoalNumber) elGoalNumber.textContent = `${stats.weekly.activitiesCount} / ${stats.weekly.targetActivities} Activities`;
    if (elGoalSubtext) elGoalSubtext.textContent = `${stats.weekly.activitiesPct}% of weekly activity goal`;
    if (elGoalBadge) elGoalBadge.textContent = `${stats.weekly.activitiesPct}%`;
    if (elGoalFill) elGoalFill.style.width = `${stats.weekly.activitiesPct}%`;

    const elMinGoalNumber = $('#goal-mins-number');
    const elMinGoalFill = $('#goal-mins-fill');
    if (elMinGoalNumber) elMinGoalNumber.textContent = `${stats.weekly.totalDurationMins} / ${stats.weekly.targetMinutes} Mins`;
    if (elMinGoalFill) elMinGoalFill.style.width = `${stats.weekly.minutesPct}%`;

    const elDistGoalNumber = $('#goal-dist-number');
    const elDistGoalFill = $('#goal-dist-fill');
    const targetDistFormatted = unit === 'miles' ? (stats.weekly.targetDistance * 0.621371).toFixed(1) + ' mi' : stats.weekly.targetDistance + ' KM';
    const currentDistFormatted = formatDistance(stats.weekly.totalDistanceKm, unit);

    if (elDistGoalNumber) elDistGoalNumber.textContent = `${currentDistFormatted} / ${targetDistFormatted}`;
    if (elDistGoalFill) elDistGoalFill.style.width = `${stats.weekly.distancePct}%`;

    const categoryTypes = ['running', 'cycling', 'walking', 'workout'];
    categoryTypes.forEach(type => {
      const typeData = stats.byType[type];
      const countEl = $(`#breakdown-count-${type}`);
      const fillEl = $(`#breakdown-fill-${type}`);
      const metaEl = $(`#breakdown-meta-${type}`);

      if (countEl) countEl.textContent = `${typeData.count} Sesi`;
      if (fillEl) fillEl.style.width = `${typeData.percentage}%`;
      if (metaEl) {
        if (type === 'workout') {
          metaEl.textContent = `${formatDuration(typeData.duration)} • ${typeData.calories} kcal`;
        } else {
          metaEl.textContent = `${formatDistance(typeData.distance, unit)} • ${formatDuration(typeData.duration)}`;
        }
      }
    });
  },

  renderActivityList() {
    const container = $('#activities-container');
    if (!container) return;

    const activities = ActivityManager.getFiltered(this.currentFilter);
    const unit = StorageEngine.getUnits();

    if (activities.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${Icons.pulse('icon-xl')}</div>
          <h3 class="empty-title">No activities yet</h3>
          <p class="empty-desc">Start your first activity and build your momentum.</p>
          <button class="btn btn-primary btn-trigger-modal">
            ${Icons.plus('icon-sm')} Add First Activity
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
      running: Icons.running('icon-lg'),
      cycling: Icons.cycling('icon-lg'),
      walking: Icons.walking('icon-lg'),
      workout: Icons.workout('icon-lg')
    };

    const typeNames = {
      running: 'Lari',
      cycling: 'Bersepeda',
      walking: 'Jalan Kaki',
      workout: 'Workout'
    };

    container.innerHTML = activities.map(act => {
      const icon = typeIcons[act.type] || Icons.pulse('icon-lg');
      const typeName = typeNames[act.type] || act.type;
      const pace = act.type === 'running' || act.type === 'walking' || act.type === 'cycling'
        ? calculatePace(act.duration, act.distance, unit)
        : '-';

      return `
        <article class="activity-card" data-id="${act.id}">
          <div class="activity-main-info">
            <div class="activity-avatar badge-${act.type}">
              ${icon}
            </div>
            <div class="activity-title-block">
              <h3>${escapeHTML(act.title)}</h3>
              <div class="activity-meta">
                <span class="badge badge-${act.type}">${typeName}</span>
                <span class="meta-item">${Icons.calendar('icon-sm')} ${formatDate(act.date)}</span>
                ${act.intensity ? `<span class="badge" style="background-color: var(--bg-subtle); color: var(--text-secondary); text-transform: capitalize;">${act.intensity}</span>` : ''}
                ${act.notes ? `<span class="meta-item" title="${escapeHTML(act.notes)}">${Icons.note('icon-sm')} ${escapeHTML(act.notes.length > 24 ? act.notes.substring(0, 24) + '...' : act.notes)}</span>` : ''}
              </div>
            </div>
          </div>

          <div class="activity-stats-row">
            ${act.distance > 0 ? `
              <div class="stat-item-inline">
                <strong>${formatDistance(act.distance, unit)}</strong>
                <span>Jarak</span>
              </div>
            ` : ''}

            <div class="stat-item-inline">
              <strong>${formatDuration(act.duration)}</strong>
              <span>Durasi</span>
            </div>

            ${act.calories > 0 ? `
              <div class="stat-item-inline">
                <strong>${act.calories} kcal</strong>
                <span>Kalori (Est.)</span>
              </div>
            ` : ''}

            ${pace !== '-' ? `
              <div class="stat-item-inline">
                <strong>${pace}</strong>
                <span>Pace Rata-rata</span>
              </div>
            ` : ''}

            <div class="activity-actions">
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
