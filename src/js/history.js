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
    searchQuery: ''
  },
  searchDebounceTimer: null,

  init() {
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    const searchInput = $('#history-search');
    const filterPills = $$('.filter-pill');
    const closeDetailBtn = $('#btn-close-detail-modal');
    const detailModalOverlay = $('#modal-activity-detail');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(this.searchDebounceTimer);
        this.searchDebounceTimer = setTimeout(() => {
          this.options.searchQuery = e.target.value;
          this.render();
        }, 150);
      });
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const filter = e.currentTarget.dataset.filter;
        this.setFilter(filter);
      });
    });

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

  setFilter(filterCategory) {
    this.options.category = filterCategory;
    $$('.filter-pill').forEach(pill => {
      if (pill.dataset.filter === filterCategory) {
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');
      } else {
        pill.classList.remove('active');
        pill.setAttribute('aria-selected', 'false');
      }
    });
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
      intensityEl.textContent = activity.heartRate > 0 ? `HR: ${activity.heartRate} bpm` : `Intensity: ${activity.intensity || 'moderate'}`;
    }
    if (dateEl) dateEl.textContent = formatDate(activity.date);
    if (durationEl) durationEl.textContent = formatDuration(activity.duration);
    if (distanceEl) distanceEl.textContent = activity.distance > 0 ? formatDistance(activity.distance, unit) : '—';
    if (caloriesEl) caloriesEl.textContent = activity.calories > 0 ? `${activity.calories} kcal` : '—';

    const pace = (activity.type === 'running' || activity.type === 'walking' || activity.type === 'cycling')
      ? calculatePace(activity.duration, activity.distance, unit)
      : '—';
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
    if (!container) return;

    const activities = ActivityManager.query({
      category: this.options.category,
      searchQuery: this.options.searchQuery,
      sortBy: 'newest'
    });
    const unit = StorageEngine.getUnits();

    // Render Summary Cards
    let totalSessions = activities.length;
    let totalDistanceKm = 0;
    let totalDurationMins = 0;
    let totalCalories = 0;

    activities.forEach(act => {
      totalDistanceKm += (Number(act.distance) || 0);
      totalDurationMins += (Number(act.duration) || 0);
      totalCalories += (Number(act.calories) || 0);
    });

    const elSessions = $('#history-stat-sessions');
    const elDistance = $('#history-stat-distance');
    const elDuration = $('#history-stat-duration');
    const elCalories = $('#history-stat-calories');

    if (elSessions) elSessions.textContent = totalSessions.toString();
    if (elDistance) elDistance.textContent = formatDistance(totalDistanceKm, unit);
    if (elDuration) elDuration.textContent = formatDuration(totalDurationMins);
    if (elCalories) elCalories.textContent = `${totalCalories.toLocaleString()} kcal`;

    // Empty state
    if (activities.length === 0) {
      const isFiltered = this.options.searchQuery.trim() !== '' || this.options.category !== 'all';
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${Icons.pulse('icon-xl')}</div>
          <h3 class="empty-title">${isFiltered ? 'Tidak ada aktivitas yang cocok dengan pencarian.' : 'Belum ada aktivitas'}</h3>
          <p class="empty-desc">${isFiltered ? 'Coba ubah kata kunci pencarian atau filter jenis olahraga.' : 'Catat sesi pertamamu dan mulai pantau progres.'}</p>
          <button class="btn btn-primary btn-trigger-modal">
            ${Icons.plus('icon-sm')} Catat Aktivitas
          </button>
        </div>
      `;

      const btnAdd = container.querySelector('.btn-trigger-modal');
      if (btnAdd) {
        btnAdd.addEventListener('click', () => DashboardController.openActivityModal());
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

    container.innerHTML = activities.map(act => {
      const icon = typeIcons[act.type] || Icons.pulse('icon-md');
      const typeName = typeNames[act.type] || act.type;

      // Extract Date & Time
      let timeStr = '';
      if (act.date) {
        const d = new Date(act.date);
        if (!isNaN(d.getTime())) {
          const hours = String(d.getHours()).padStart(2, '0');
          const mins = String(d.getMinutes()).padStart(2, '0');
          timeStr = ` · ${hours}:${mins}`;
        }
      }

      return `
        <article class="activity-row" data-id="${act.id}">
          <div class="activity-row-main">
            <div class="activity-row-icon ${act.type}">
              ${icon}
            </div>
            <div class="activity-row-info">
              <h4>${escapeHTML(act.title)}</h4>
              <div class="activity-row-meta">
                <span>${typeName}</span> · <span>${formatDate(act.date)}${timeStr}</span>
                ${act.heartRate > 0 ? `<span style="margin-left: 0.35rem; color: var(--color-primary); font-weight: 700;">❤️ ${act.heartRate} bpm</span>` : ''}
              </div>
            </div>
          </div>

          <div class="activity-row-metrics">
            <div class="activity-row-stat">
              <strong>${act.type === 'workout' && !act.distance ? '—' : formatDistance(act.distance, unit)}</strong>
              <span>Jarak</span>
            </div>

            <div class="activity-row-stat">
              <strong>${formatDuration(act.duration)}</strong>
              <span>Durasi</span>
            </div>

            <div class="activity-row-stat">
              <strong>${act.calories > 0 ? `${act.calories} kcal` : '—'}</strong>
              <span>Kalori (Est.)</span>
            </div>

            <div class="activity-row-actions">
              <button class="btn-icon btn-edit-activity" data-id="${act.id}" title="Edit Aktivitas" aria-label="Edit aktivitas">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </button>
              <button class="btn-icon btn-delete-activity" data-id="${act.id}" title="Hapus Aktivitas" aria-label="Hapus aktivitas">
                ${Icons.trash('icon-sm')}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
};
