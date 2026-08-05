/**
 * HabitPulse Activity History Controller
 */
import { ActivityManager } from './activities.js';
import { DashboardController } from './dashboard.js';
import { StorageEngine } from './storage.js';
import { $, $$, formatDate, formatDuration, formatDistance, calculatePace, escapeHTML } from './utils.js';
import { Icons } from './icons.js';

export const HistoryController = {
  options: {
    category: 'all',
    timeRange: 'all',
    sortBy: 'newest',
    searchQuery: ''
  },

  init() {
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    const searchInput = $('#history-search');
    const categorySelect = $('#history-filter-category');
    const timeRangeSelect = $('#history-filter-timerange');
    const sortSelect = $('#history-filter-sort');
    const clearFiltersBtn = $('#btn-clear-history-filters');

    const closeDetailBtn = $('#btn-close-detail-modal');
    const detailModalOverlay = $('#modal-activity-detail');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.options.searchQuery = e.target.value;
        this.render();
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => {
        this.options.category = e.target.value;
        this.render();
      });
    }

    if (timeRangeSelect) {
      timeRangeSelect.addEventListener('change', (e) => {
        this.options.timeRange = e.target.value;
        this.render();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.options.sortBy = e.target.value;
        this.render();
      });
    }

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => this.resetFilters());
    }

    if (closeDetailBtn) {
      closeDetailBtn.addEventListener('click', () => this.closeDetailModal());
    }

    if (detailModalOverlay) {
      detailModalOverlay.addEventListener('click', (e) => {
        if (e.target === detailModalOverlay) this.closeDetailModal();
      });
    }

    const historyContainer = $('#history-list-container');
    if (historyContainer) {
      historyContainer.addEventListener('click', (e) => {
        const viewBtn = e.target.closest('.btn-view-activity');
        const editBtn = e.target.closest('.btn-edit-activity');
        const deleteBtn = e.target.closest('.btn-delete-activity');

        if (viewBtn) {
          const id = viewBtn.dataset.id;
          this.openDetailModal(id);
        } else if (editBtn) {
          const id = editBtn.dataset.id;
          DashboardController.openEditActivityModal(id);
        } else if (deleteBtn) {
          const id = deleteBtn.dataset.id;
          DashboardController.openDeleteModal(id);
        }
      });
    }
  },

  resetFilters() {
    this.options = {
      category: 'all',
      timeRange: 'all',
      sortBy: 'newest',
      searchQuery: ''
    };

    const searchInput = $('#history-search');
    const categorySelect = $('#history-filter-category');
    const timeRangeSelect = $('#history-filter-timerange');
    const sortSelect = $('#history-filter-sort');

    if (searchInput) searchInput.value = '';
    if (categorySelect) categorySelect.value = 'all';
    if (timeRangeSelect) timeRangeSelect.value = 'all';
    if (sortSelect) sortSelect.value = 'newest';

    this.render();
  },

  openDetailModal(id) {
    const activity = ActivityManager.getById(id);
    if (!activity) return;

    const unit = StorageEngine.getUnits();
    const modal = $('#modal-activity-detail');
    const iconEl = $('#detail-icon');
    const titleEl = $('#detail-title');
    const typeEl = $('#detail-type-badge');
    const intensityEl = $('#detail-intensity-badge');
    const dateEl = $('#detail-date');
    const durationEl = $('#detail-duration');
    const distanceEl = $('#detail-distance');
    const caloriesEl = $('#detail-calories');
    const paceEl = $('#detail-pace');
    const notesEl = $('#detail-notes');

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

    if (iconEl) iconEl.innerHTML = typeIcons[activity.type] || Icons.pulse('icon-lg');
    if (titleEl) titleEl.textContent = activity.title;
    if (typeEl) {
      typeEl.textContent = typeNames[activity.type] || activity.type;
      typeEl.className = `badge badge-${activity.type}`;
    }
    if (intensityEl) {
      intensityEl.textContent = `Intensity: ${activity.intensity || 'moderate'}`;
    }
    if (dateEl) dateEl.textContent = formatDate(activity.date);
    if (durationEl) durationEl.textContent = formatDuration(activity.duration);
    if (distanceEl) distanceEl.textContent = activity.distance > 0 ? formatDistance(activity.distance, unit) : '-';
    if (caloriesEl) caloriesEl.textContent = activity.calories > 0 ? `${activity.calories} kcal` : '-';

    const pace = (activity.type === 'running' || activity.type === 'walking' || activity.type === 'cycling')
      ? calculatePace(activity.duration, activity.distance, unit)
      : '-';
    if (paceEl) paceEl.textContent = pace;

    if (notesEl) notesEl.textContent = activity.notes || 'Tidak ada catatan tambahan.';

    if (modal) modal.classList.add('active');
  },

  closeDetailModal() {
    const modal = $('#modal-activity-detail');
    if (modal) modal.classList.remove('active');
  },

  render() {
    const container = $('#history-list-container');
    const counterEl = $('#history-result-counter');
    if (!container) return;

    const activities = ActivityManager.query(this.options);
    const unit = StorageEngine.getUnits();

    if (counterEl) {
      const count = activities.length;
      counterEl.textContent = `${count} ${count === 1 ? 'Activity' : 'Activities'} Found`;
    }

    if (activities.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${Icons.pulse('icon-xl')}</div>
          <h3 class="empty-title">No matching activities found</h3>
          <p class="empty-desc">Try adjusting your search terms or filters to find what you're looking for.</p>
          <button id="btn-clear-history-filters" class="btn btn-secondary">
            Reset Filters
          </button>
        </div>
      `;

      const resetBtn = $('#btn-clear-history-filters');
      if (resetBtn) resetBtn.addEventListener('click', () => this.resetFilters());
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
        <article class="activity-card card-hover" data-id="${act.id}">
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

            <div class="activity-actions">
              <button class="btn-icon btn-view-activity" data-id="${act.id}" title="View Details" aria-label="View Details">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button class="btn-icon btn-edit-activity" data-id="${act.id}" title="Edit Aktivitas" aria-label="Edit Aktivitas">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button class="btn-icon btn-delete-activity" data-id="${act.id}" title="Hapus Aktivitas" aria-label="Hapus Aktivitas">
                ${Icons.trash('icon-sm')}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
};
