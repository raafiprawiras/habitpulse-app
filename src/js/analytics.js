/**
 * HabitPulse Analytics & Statistics Controller
 */
import Chart from 'chart.js/auto';
import { ActivityManager } from './activities.js';
import { StatisticsManager } from './statistics.js';
import { StorageEngine } from './storage.js';
import { $, formatDistance, formatDuration } from './utils.js';
import { Icons } from './icons.js';

export const AnalyticsController = {
  trendChart: null,
  distributionChart: null,
  intensityChart: null,

  init() {
    this.render();
  },

  destroyCharts() {
    if (this.trendChart) {
      this.trendChart.destroy();
      this.trendChart = null;
    }
    if (this.distributionChart) {
      this.distributionChart.destroy();
      this.distributionChart = null;
    }
    if (this.intensityChart) {
      this.intensityChart.destroy();
      this.intensityChart = null;
    }
  },

  render() {
    const container = $('#analytics-section-content');
    if (!container) return;

    this.destroyCharts();

    const activities = ActivityManager.getAll();
    const unit = StorageEngine.getUnits();
    const stats = StatisticsManager.calculateOverview(activities);
    const trendData = StatisticsManager.calculateFourWeeksTrend(activities);
    const metricsData = StatisticsManager.calculateCategoryMetrics(activities);

    // Summary Totals
    const totalSessions = stats.totalActivities;
    const totalDistance = formatDistance(stats.totalDistanceKm, unit);
    const totalTime = formatDuration(stats.totalDurationMins);
    const totalCalories = stats.totalCalories > 0 ? `${stats.totalCalories.toLocaleString('id-ID')} kcal` : '0 kcal';

    const hasActivities = activities.length > 0;

    container.innerHTML = `
      <!-- Summary Statistics (4 Cards) -->
      <div class="statistics-summary-grid">
        <div class="summary-card card-hover">
          <span class="summary-label">TOTAL SESI</span>
          <strong class="summary-value">${totalSessions}</strong>
        </div>
        <div class="summary-card card-hover">
          <span class="summary-label">TOTAL JARAK</span>
          <strong class="summary-value">${totalDistance}</strong>
        </div>
        <div class="summary-card card-hover">
          <span class="summary-label">TOTAL WAKTU</span>
          <strong class="summary-value">${totalTime}</strong>
        </div>
        <div class="summary-card card-hover">
          <span class="summary-label">TOTAL KALORI</span>
          <strong class="summary-value">${totalCalories}</strong>
        </div>
      </div>

      <!-- Charts Row 1: Tren 4 minggu (2/3) & Distribusi menit (1/3) -->
      <div class="statistics-charts-row1">
        <div class="statistics-chart-card">
          <div class="chart-card-header">
            <div>
              <h3 class="chart-card-title">Tren 4 minggu</h3>
              <p class="chart-card-subtitle">Total menit aktivitas fisik per minggu dalam 4 minggu terakhir.</p>
            </div>
          </div>
          <div class="statistics-chart-wrapper">
            ${!hasActivities ? `<div class="chart-empty-overlay">Belum ada cukup data untuk menampilkan tren.</div>` : ''}
            <canvas id="chart-trend-canvas" aria-label="Grafik tren aktivitas empat minggu terakhir" role="img"></canvas>
          </div>
        </div>

        <div class="statistics-chart-card">
          <div class="chart-card-header">
            <div>
              <h3 class="chart-card-title">Distribusi menit</h3>
              <p class="chart-card-subtitle">Persentase menit aktif per kategori olahraga.</p>
            </div>
          </div>
          <div class="statistics-chart-wrapper">
            ${!hasActivities ? `<div class="chart-empty-overlay">Belum ada aktivitas yang dapat dibandingkan.</div>` : ''}
            <canvas id="chart-distribution-canvas" aria-label="Grafik distribusi menit olahraga berdasarkan kategori" role="img"></canvas>
          </div>
        </div>
      </div>

      <!-- Charts Row 2: Profil Intensitas / Durasi Rata-rata & Rekap per Cabang -->
      <div class="statistics-charts-row2">
        <div class="statistics-chart-card">
          <div class="chart-card-header">
            <div>
              <h3 class="chart-card-title">${metricsData.hasHRData ? 'Profil intensitas (rata-rata HR)' : 'Profil durasi rata-rata'}</h3>
              <p class="chart-card-subtitle">${metricsData.hasHRData ? 'Rata-rata detak jantung (bpm) berdasarkan cabang olahraga.' : 'Rata-rata menit per sesi berdasarkan cabang olahraga.'}</p>
            </div>
          </div>
          <div class="statistics-chart-wrapper">
            ${!hasActivities ? `<div class="chart-empty-overlay">Belum ada data untuk profil cabang olahraga.</div>` : ''}
            <canvas id="chart-intensity-canvas" aria-label="Grafik profil olahraga" role="img"></canvas>
          </div>
        </div>

        <div class="statistics-chart-card">
          <div class="chart-card-header">
            <div>
              <h3 class="chart-card-title">Rekap per cabang</h3>
              <p class="chart-card-subtitle">Ringkasan total sesi dan menit aktif per kategori.</p>
            </div>
          </div>
          
          <div class="recap-list-container">
            ${this.renderRecapList(metricsData.categories)}
          </div>
        </div>
      </div>
    `;

    if (hasActivities) {
      setTimeout(() => {
        this.initTrendChart(trendData);
        this.initDistributionChart(metricsData.categories);
        this.initIntensityChart(metricsData);
      }, 50);
    }
  },

  renderRecapList(categories) {
    const list = Object.values(categories);
    return list.map(c => `
      <div class="recap-row">
        <div class="recap-left">
          <span class="recap-dot" style="background-color: ${c.color};"></span>
          <span class="recap-name">${c.name}</span>
        </div>
        <div class="recap-right">
          <span class="recap-count">${c.count} sesi</span>
          <span class="recap-duration">${c.duration > 0 ? `${c.duration} m` : '0 m'}</span>
        </div>
      </div>
    `).join('');
  },

  initTrendChart(trendData) {
    const ctx = $('#chart-trend-canvas');
    if (!ctx) return;

    const labels = trendData.map(w => w.label);
    const dataValues = trendData.map(w => w.minutes);

    this.trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Menit Aktif',
          data: dataValues,
          borderColor: '#7CE424',
          backgroundColor: 'rgba(124, 228, 36, 0.08)',
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#7CE424',
          pointBorderColor: '#070D10',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#070D10',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            titleColor: '#F8FAFC',
            bodyColor: '#7CE424',
            padding: 10,
            displayColors: false,
            callbacks: {
              title: (items) => items[0].label,
              label: (item) => `${item.raw} menit`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8', font: { family: 'sans-serif', size: 12 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8', font: { family: 'sans-serif', size: 12 } }
          }
        }
      }
    });
  },

  initDistributionChart(categories) {
    const ctx = $('#chart-distribution-canvas');
    if (!ctx) return;

    const list = Object.values(categories);
    const labels = list.map(c => c.name);
    const dataValues = list.map(c => c.duration);
    const backgroundColors = list.map(c => c.color);

    this.distributionChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: backgroundColors,
          borderColor: '#121A1E',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94A3B8',
              usePointStyle: true,
              padding: 14,
              font: { size: 12, weight: '600' }
            }
          },
          tooltip: {
            backgroundColor: '#070D10',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            titleColor: '#F8FAFC',
            bodyColor: '#F8FAFC',
            padding: 10,
            callbacks: {
              label: (item) => {
                const total = item.dataset.data.reduce((a, b) => a + b, 0);
                const pct = total > 0 ? Math.round((item.raw / total) * 100) : 0;
                return ` ${item.label}: ${item.raw} menit (${pct}%)`;
              }
            }
          }
        },
        cutout: '68%'
      }
    });
  },

  initIntensityChart(metricsData) {
    const ctx = $('#chart-intensity-canvas');
    if (!ctx) return;

    const list = Object.values(metricsData.categories);
    const labels = list.map(c => c.name);

    if (metricsData.hasHRData) {
      const dataValues = list.map(c => c.avgHR);

      this.intensityChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Rata-rata HR (bpm)',
            data: dataValues,
            backgroundColor: 'rgba(124, 228, 36, 0.20)',
            borderColor: '#7CE424',
            borderWidth: 2,
            pointBackgroundColor: '#7CE424',
            pointBorderColor: '#070D10',
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#070D10',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              borderWidth: 1,
              callbacks: {
                label: (item) => ` ${item.raw > 0 ? `${item.raw} bpm` : 'Belum ada data HR'}`
              }
            }
          },
          scales: {
            r: {
              angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
              grid: { color: 'rgba(255, 255, 255, 0.08)' },
              pointLabels: { color: '#94A3B8', font: { size: 11, weight: '600' } },
              ticks: { color: '#64748B', backdropColor: 'transparent' },
              beginAtZero: true
            }
          }
        }
      });
    } else {
      // Fallback: Average Duration per Session
      const dataValues = list.map(c => c.avgDuration);

      this.intensityChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Durasi Rata-rata (Menit/Sesi)',
            data: dataValues,
            backgroundColor: list.map(c => c.color),
            borderRadius: 6,
            barThickness: 28
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#070D10',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              borderWidth: 1,
              callbacks: {
                label: (item) => ` Rata-rata: ${item.raw} menit / sesi`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#94A3B8', font: { size: 12, weight: '600' } }
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94A3B8', font: { size: 12 } }
            }
          }
        }
      });
    }
  }
};

