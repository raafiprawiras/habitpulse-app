/**
 * HabitPulse Settings & Data Management Controller
 */
import { StorageEngine, DEFAULT_SETTINGS } from './storage.js';
import { ThemeManager } from './theme.js';
import { DashboardController } from './dashboard.js';
import { HistoryController } from './history.js';
import { AnalyticsController } from './analytics.js';
import { AchievementsController } from './achievements.js';
import { $, $$ } from './utils.js';

export const SettingsController = {
  pendingImportData: null,

  init() {
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    // 1. Profile Display Name & Default Activity
    const displayNameInput = $('#setting-display-name');
    const defaultActivitySelect = $('#setting-default-activity');

    if (displayNameInput) {
      displayNameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim() || 'Athlete';
        StorageEngine.updateSetting('profile', 'displayName', val);
        DashboardController.renderGreeting();
      });
    }

    if (defaultActivitySelect) {
      defaultActivitySelect.addEventListener('change', (e) => {
        StorageEngine.updateSetting('profile', 'defaultActivity', e.target.value);
      });
    }

    // 2. Appearance: Theme & Density Segmented Controls
    const themeBtns = $$('.theme-btn');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.value;
        ThemeManager.applyTheme(val);
        StorageEngine.updateSetting('appearance', 'theme', val);
        this.updateSegmentedActive(themeBtns, btn);
        AnalyticsController.render();
      });
    });

    const densityBtns = $$('.density-btn');
    densityBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.value;
        ThemeManager.applyDensity(val);
        StorageEngine.updateSetting('appearance', 'density', val);
        this.updateSegmentedActive(densityBtns, btn);
      });
    });

    // 3. Activity & Units
    const unitBtns = $$('.unit-btn');
    unitBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.value;
        StorageEngine.saveUnits(val);
        this.updateSegmentedActive(unitBtns, btn);
        this.reRenderAllControllers();
      });
    });

    const weekStartSelect = $('#setting-week-start');
    if (weekStartSelect) {
      weekStartSelect.addEventListener('change', (e) => {
        StorageEngine.updateSetting('activity', 'weekStart', e.target.value);
        this.reRenderAllControllers();
      });
    }

    const timeFormatSelect = $('#setting-time-format');
    if (timeFormatSelect) {
      timeFormatSelect.addEventListener('change', (e) => {
        StorageEngine.updateSetting('activity', 'timeFormat', e.target.value);
        HistoryController.render();
      });
    }

    const showCaloriesToggle = $('#setting-show-calories');
    if (showCaloriesToggle) {
      showCaloriesToggle.addEventListener('change', (e) => {
        StorageEngine.updateSetting('activity', 'showCalories', e.target.checked);
        this.reRenderAllControllers();
      });
    }

    // 4. Target & Progress: Show Achievements
    const showAchievementsToggle = $('#setting-show-achievements');
    if (showAchievementsToggle) {
      showAchievementsToggle.addEventListener('change', (e) => {
        StorageEngine.updateSetting('goals', 'showAchievements', e.target.checked);
        AchievementsController.render();
      });
    }

    // 5. In-App Notifications
    const notifyAchToggle = $('#setting-notify-achievement');
    const notifyGoalToggle = $('#setting-notify-weekly-goal');
    const notifyStreakToggle = $('#setting-notify-streak');

    if (notifyAchToggle) {
      notifyAchToggle.addEventListener('change', (e) => {
        StorageEngine.updateSetting('notifications', 'notifyAchievement', e.target.checked);
      });
    }

    if (notifyGoalToggle) {
      notifyGoalToggle.addEventListener('change', (e) => {
        StorageEngine.updateSetting('notifications', 'notifyWeeklyGoal', e.target.checked);
      });
    }

    if (notifyStreakToggle) {
      notifyStreakToggle.addEventListener('change', (e) => {
        StorageEngine.updateSetting('notifications', 'notifyStreak', e.target.checked);
      });
    }

    // 6. Accessibility
    const reduceMotionSelect = $('#setting-reduce-motion');
    if (reduceMotionSelect) {
      reduceMotionSelect.addEventListener('change', (e) => {
        ThemeManager.applyReduceMotion(e.target.value);
        StorageEngine.updateSetting('accessibility', 'reduceMotion', e.target.value);
      });
    }

    const textSizeSelect = $('#setting-text-size');
    if (textSizeSelect) {
      textSizeSelect.addEventListener('change', (e) => {
        ThemeManager.applyTextSize(e.target.value);
        StorageEngine.updateSetting('accessibility', 'textSize', e.target.value);
      });
    }

    const highContrastToggle = $('#setting-high-contrast');
    if (highContrastToggle) {
      highContrastToggle.addEventListener('change', (e) => {
        ThemeManager.applyHighContrast(e.target.checked);
        StorageEngine.updateSetting('accessibility', 'highContrast', e.target.checked);
      });
    }

    // 7. Data & Privacy: Export, Import, Reset, Clear All
    const btnExport = $('#btn-export-data');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportJSON());
    }

    const btnTriggerImport = $('#btn-trigger-import-data');
    const fileInputImport = $('#file-input-import');
    if (btnTriggerImport && fileInputImport) {
      btnTriggerImport.addEventListener('click', () => fileInputImport.click());
      fileInputImport.addEventListener('change', (e) => this.handleFileSelected(e));
    }

    // Import Modal Confirmation
    const modalImport = $('#modal-import-confirm');
    const btnCloseImportModal = $('#btn-close-import-modal');
    const btnCancelImport = $('#btn-cancel-import');
    const btnConfirmImport = $('#btn-confirm-import');

    if (btnCloseImportModal) btnCloseImportModal.addEventListener('click', () => this.closeImportModal());
    if (btnCancelImport) btnCancelImport.addEventListener('click', () => this.closeImportModal());
    if (modalImport) {
      modalImport.addEventListener('click', (e) => {
        if (e.target === modalImport) this.closeImportModal();
      });
    }
    if (btnConfirmImport) {
      btnConfirmImport.addEventListener('click', () => this.executeImport());
    }

    // Reset Settings Controls
    const btnTriggerReset = $('#btn-trigger-reset-settings');
    const modalReset = $('#modal-reset-settings-confirm');
    const btnCloseResetModal = $('#btn-close-reset-modal');
    const btnCancelReset = $('#btn-cancel-reset-settings');
    const btnConfirmReset = $('#btn-confirm-reset-settings');

    if (btnTriggerReset && modalReset) {
      btnTriggerReset.addEventListener('click', () => modalReset.classList.add('active'));
    }
    if (btnCloseResetModal) btnCloseResetModal.addEventListener('click', () => this.closeResetModal());
    if (btnCancelReset) btnCancelReset.addEventListener('click', () => this.closeResetModal());
    if (modalReset) {
      modalReset.addEventListener('click', (e) => {
        if (e.target === modalReset) this.closeResetModal();
      });
    }
    if (btnConfirmReset) {
      btnConfirmReset.addEventListener('click', () => this.executeResetSettings());
    }

    // Clear All Data Controls
    const btnClearAll = $('#btn-trigger-clear-data');
    const modalClear = $('#modal-clear-confirm');
    const btnCloseClearModal = $('#btn-close-clear-modal');
    const btnCancelClear = $('#btn-cancel-clear');
    const btnConfirmClear = $('#btn-confirm-clear');

    if (btnClearAll && modalClear) {
      btnClearAll.addEventListener('click', () => modalClear.classList.add('active'));
    }
    if (btnCloseClearModal) btnCloseClearModal.addEventListener('click', () => this.closeClearModal());
    if (btnCancelClear) btnCancelClear.addEventListener('click', () => this.closeClearModal());
    if (modalClear) {
      modalClear.addEventListener('click', (e) => {
        if (e.target === modalClear) this.closeClearModal();
      });
    }
    if (btnConfirmClear) {
      btnConfirmClear.addEventListener('click', () => this.executeClearAllData());
    }
  },

  updateSegmentedActive(btns, activeBtn) {
    btns.forEach(b => b.classList.toggle('active', b === activeBtn));
  },

  closeResetModal() {
    const modal = $('#modal-reset-settings-confirm');
    if (modal) modal.classList.remove('active');
  },

  closeImportModal() {
    const modal = $('#modal-import-confirm');
    if (modal) modal.classList.remove('active');
    this.pendingImportData = null;
  },

  closeClearModal() {
    const modalClear = $('#modal-clear-confirm');
    if (modalClear) modalClear.classList.remove('active');
  },

  exportJSON() {
    const data = StorageEngine.exportAllData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    const todayStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `habitpulse-backup-${todayStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    DashboardController.showToast('Data berhasil diekspor ke file JSON.', 'success');
  },

  handleFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.activities)) {
          DashboardController.showToast('Format file backup JSON tidak valid.', 'error');
          event.target.value = '';
          return;
        }
        this.pendingImportData = parsed;
        const modalImport = $('#modal-import-confirm');
        if (modalImport) modalImport.classList.add('active');
      } catch (err) {
        DashboardController.showToast('Gagal membaca file JSON.', 'error');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  },

  executeImport() {
    if (!this.pendingImportData) return;
    const result = StorageEngine.importData(this.pendingImportData);
    this.closeImportModal();

    if (result.success) {
      ThemeManager.init();
      this.render();
      this.reRenderAllControllers();
      DashboardController.showToast('Data berhasil diimpor dan dipulihkan.', 'success');
    } else {
      DashboardController.showToast(result.error || 'Gagal memulihkan data.', 'error');
    }
  },

  executeResetSettings() {
    StorageEngine.resetSettings();
    this.closeResetModal();
    ThemeManager.init();
    this.render();
    this.reRenderAllControllers();
    DashboardController.showToast('Pengaturan berhasil direset ke standar.', 'success');
  },

  executeClearAllData() {
    StorageEngine.clearAllData();
    this.closeClearModal();
    ThemeManager.init();
    this.render();
    this.reRenderAllControllers();
    DashboardController.showToast('Semua data berhasil dihapus.', 'error');
  },

  reRenderAllControllers() {
    DashboardController.render();
    HistoryController.render();
    AnalyticsController.render();
    AchievementsController.render();
  },

  render() {
    const settings = StorageEngine.getSettings();

    // 1. Profile
    const displayNameInput = $('#setting-display-name');
    const defaultActivitySelect = $('#setting-default-activity');
    if (displayNameInput) displayNameInput.value = settings.profile.displayName || 'Athlete';
    if (defaultActivitySelect) defaultActivitySelect.value = settings.profile.defaultActivity || 'running';

    // 2. Appearance
    const themeBtns = $$('.theme-btn');
    themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === settings.appearance.theme);
    });

    const densityBtns = $$('.density-btn');
    densityBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === settings.appearance.density);
    });

    // 3. Activity & Units
    const unitBtns = $$('.unit-btn');
    unitBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === settings.activity.unit);
    });

    const weekStartSelect = $('#setting-week-start');
    const timeFormatSelect = $('#setting-time-format');
    const showCaloriesToggle = $('#setting-show-calories');
    if (weekStartSelect) weekStartSelect.value = settings.activity.weekStart || 'monday';
    if (timeFormatSelect) timeFormatSelect.value = settings.activity.timeFormat || '24h';
    if (showCaloriesToggle) showCaloriesToggle.checked = Boolean(settings.activity.showCalories);

    // 4. Goals & Achievements
    const showAchievementsToggle = $('#setting-show-achievements');
    if (showAchievementsToggle) showAchievementsToggle.checked = Boolean(settings.goals.showAchievements);

    // 5. Notifications
    const notifyAchToggle = $('#setting-notify-achievement');
    const notifyGoalToggle = $('#setting-notify-weekly-goal');
    const notifyStreakToggle = $('#setting-notify-streak');
    if (notifyAchToggle) notifyAchToggle.checked = Boolean(settings.notifications.notifyAchievement);
    if (notifyGoalToggle) notifyGoalToggle.checked = Boolean(settings.notifications.notifyWeeklyGoal);
    if (notifyStreakToggle) notifyStreakToggle.checked = Boolean(settings.notifications.notifyStreak);

    // 6. Accessibility
    const reduceMotionSelect = $('#setting-reduce-motion');
    const textSizeSelect = $('#setting-text-size');
    const highContrastToggle = $('#setting-high-contrast');
    if (reduceMotionSelect) reduceMotionSelect.value = settings.accessibility.reduceMotion || 'system';
    if (textSizeSelect) textSizeSelect.value = settings.accessibility.textSize || 'normal';
    if (highContrastToggle) highContrastToggle.checked = Boolean(settings.accessibility.highContrast);
  }
};

