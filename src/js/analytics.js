/**
 * HabitPulse Analytics & Statistics Controller
 */
import { ActivityManager } from './activities.js';
import { StatisticsManager } from './statistics.js';
import { StorageEngine } from './storage.js';
import { $, $$, formatDistance, formatDuration } from './utils.js';
import { Icons } from './icons.js';

export const AnalyticsController = {
  init() {
    this.render();
  },

  render() {
    const container = $('#analytics-section-content');
    if (!container) return;

    const activities = ActivityManager.getAll();
    const unit = StorageEngine.getUnits();

    if (activities.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${Icons.pulse('icon-xl')}</div>
          <h3 class="empty-title">Insufficient Data for Analytics</h3>
          <p class="empty-desc">Record your first sport activity to unlock detailed health statistics, weekly comparisons, and activity streak analytics.</p>
          <button class="btn btn-primary btn-trigger-modal">
            ${Icons.plus('icon-sm')} Add Activity Now
          </button>
        </div>
      `;

      const btn = container.querySelector('.btn-trigger-modal');
      if (btn) {
        btn.addEventListener('click', () => {
          const addBtn = $('#btn-add-activity');
          if (addBtn) addBtn.click();
        });
      }
      return;
    }

    const stats = StatisticsManager.calculateOverview(activities);
    const comparison = StatisticsManager.calculateWeeklyComparison(activities);
    const insights = StatisticsManager.generateSmartInsights(activities, stats);

    container.innerHTML = `
      <!-- 8 Key Metrics Cards Grid -->
      <div class="stats-8-grid">
        <div class="stat-card">
          <div class="stat-icon-box">${Icons.trophy('icon-lg')}</div>
          <div class="stat-details">
            <div class="stat-value">${stats.totalActivities}</div>
            <div class="stat-label">Total Activities</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-box">${Icons.distance('icon-lg')}</div>
          <div class="stat-details">
            <div class="stat-value">${formatDistance(stats.totalDistanceKm, unit)}</div>
            <div class="stat-label">Total Distance</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-box">${Icons.duration('icon-lg')}</div>
          <div class="stat-details">
            <div class="stat-value">${formatDuration(stats.totalDurationMins)}</div>
            <div class="stat-label">Total Active Time</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-box">${Icons.calories('icon-lg')}</div>
          <div class="stat-details">
            <div class="stat-value">${stats.totalCalories.toLocaleString()} kcal</div>
            <div class="stat-label">Estimated Calories</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-box">${Icons.duration('icon-lg')}</div>
          <div class="stat-details">
            <div class="stat-value">${stats.avgDurationMins}m</div>
            <div class="stat-label">Average Duration</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-box">${Icons.pulse('icon-lg')}</div>
          <div class="stat-details">
            <div class="stat-value" style="font-size: 1.2rem; text-transform: capitalize;">${stats.mostActiveSport}</div>
            <div class="stat-label">Most Active Sport</div>
          </div>
        </div>

        <div class="stat-card" style="border-left: 4px solid var(--primary);">
          <div class="stat-icon-box" style="background-color: rgba(22, 163, 74, 0.15); color: var(--primary);">⚡</div>
          <div class="stat-details">
            <div class="stat-value">${stats.currentStreak} ${stats.currentStreak === 1 ? 'Day' : 'Days'}</div>
            <div class="stat-label">Current Streak</div>
          </div>
        </div>

        <div class="stat-card" style="border-left: 4px solid var(--secondary);">
          <div class="stat-icon-box" style="background-color: rgba(34, 197, 94, 0.15); color: var(--secondary);">🔥</div>
          <div class="stat-details">
            <div class="stat-value">${stats.bestStreak} ${stats.bestStreak === 1 ? 'Day' : 'Days'}</div>
            <div class="stat-label">Best Streak</div>
          </div>
        </div>
      </div>

      <!-- Weekly Comparison Banner -->
      <div class="weekly-comparison-card">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">This Week vs Last Week Comparison</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Perbandingan aktivitas fisik Anda minggu ini dengan minggu lalu.</p>
          </div>
          <div style="display: flex; gap: 1.5rem;">
            <div class="comp-item">
              <strong style="display: block; font-size: 1.1rem; font-weight: 800;">${comparison.thisWeek.count} Sesi</strong>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">This Week (${comparison.deltas.count >= 0 ? '+' : ''}${comparison.deltas.count})</span>
            </div>

            <div class="comp-item">
              <strong style="display: block; font-size: 1.1rem; font-weight: 800;">${formatDuration(comparison.thisWeek.duration)}</strong>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">Active Time</span>
            </div>

            <div class="comp-item">
              <strong style="display: block; font-size: 1.1rem; font-weight: 800;">${formatDistance(comparison.thisWeek.distance, unit)}</strong>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">Distance</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics Charts Grid -->
      <div class="charts-grid" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
        <!-- Weekly Activity Bar Chart -->
        <div class="card">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">Weekly Active Minutes</h3>
          ${this.renderWeeklyBarChartSVG(stats.dailyMins)}
        </div>

        <!-- Activity Distribution -->
        <div class="card">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">Category Distribution</h3>
          ${this.renderDistributionSVG(stats.byType, activities.length)}
        </div>
      </div>

      <!-- Automated Smart Insights Card -->
      ${insights.length > 0 ? `
        <div class="insights-card">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
            <span style="font-size: 1.25rem;">💡</span>
            <h3 style="font-size: 1rem; font-weight: 800; color: var(--text-primary);">Smart Habit Insights</h3>
          </div>
          <ul class="insights-list">
            ${insights.map(item => `<li>• ${item}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    `;
  },

  renderWeeklyBarChartSVG(dailyMins) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const maxVal = Math.max(...dailyMins, 60);

    return `
      <div class="chart-wrapper" style="width: 100%; height: 220px; display: flex; align-items: flex-end; justify-content: space-between; gap: 0.75rem; padding-top: 1.5rem; border-bottom: 1px solid var(--border-color);">
        ${dailyMins.map((mins, i) => {
          const heightPct = Math.round((mins / maxVal) * 100);
          return `
            <div class="chart-bar-col" style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; position: relative;">
              <div class="chart-tooltip">${days[i]}: ${mins} mins</div>
              <div class="chart-bar-fill" style="width: 100%; max-width: 32px; height: ${Math.max(heightPct, 4)}%; background: linear-gradient(180deg, var(--secondary) 0%, var(--primary) 100%); border-radius: var(--radius-sm); transition: height 0.6s ease;"></div>
              <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-top: 0.5rem;">${days[i]}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  renderDistributionSVG(byType, totalCount) {
    if (totalCount === 0) return `<p style="font-size: 0.85rem; color: var(--text-secondary);">No activity data available.</p>`;

    const types = [
      { key: 'running', name: 'Lari', color: 'var(--activity-running)' },
      { key: 'cycling', name: 'Bersepeda', color: 'var(--activity-cycling)' },
      { key: 'walking', name: 'Jalan Kaki', color: 'var(--activity-walking)' },
      { key: 'workout', name: 'Workout', color: 'var(--activity-workout)' }
    ];

    return `
      <div style="display: flex; flex-direction: column; gap: 0.875rem;">
        <div style="width: 100%; height: 12px; border-radius: var(--radius-full); overflow: hidden; display: flex; background-color: var(--bg-subtle);">
          ${types.map(t => {
            const pct = byType[t.key] ? byType[t.key].percentage : 0;
            return pct > 0 ? `<div style="width: ${pct}%; background-color: ${t.color}; height: 100%;" title="${t.name}: ${pct}%"></div>` : '';
          }).join('')}
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
          ${types.map(t => {
            const item = byType[t.key];
            const count = item ? item.count : 0;
            const pct = item ? item.percentage : 0;
            return `
              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${t.color}; display: inline-block;"></span>
                  <span style="color: var(--text-primary); font-weight: 600;">${t.name}</span>
                </div>
                <span style="color: var(--text-secondary); font-weight: 700;">${count} Sesi (${pct}%)</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
};
