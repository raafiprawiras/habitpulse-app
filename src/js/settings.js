/**
 * HabitPulse Settings & Data Management Controller
 */
import { StorageEngine } from './storage.js';
import { ThemeManager } from './theme.js';
import { DashboardController } from './dashboard.js';
import { $, $$ } from './utils.js';

export const SettingsController = {
  init() {
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    // 1. Appearance Radio Change
    const themeRadios = $$('input[name="setting-theme"]');
    themeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        ThemeManager.applyTheme(e.target.value);
        DashboardController.showToast(`Theme changed to ${e.target.value}`, 'success');
      });
    });

    // 2. Units Radio Change
    const unitRadios = $$('input[name="setting-unit"]');
    unitRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        StorageEngine.saveUnits(e.target.value);
        DashboardController.render();
        DashboardController.showToast(`Unit changed to ${e.target.value.toUpperCase()}`, 'success');
      });
    });

    // 3. Export Data Button
    const btnExport = $('#btn-export-data');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportJSON());
    }

    // 4. Import Data Button & Input
    const btnImport = $('#btn-import-data');
    const fileInputImport = $('#file-input-import');
    if (btnImport && fileInputImport) {
      btnImport.addEventListener('click', () => fileInputImport.click());
      fileInputImport.addEventListener('change', (e) => this.handleFileImport(e));
    }

    // 5. Clear All Data Controls
    const btnClearAll = $('#btn-trigger-clear-data');
    const modalClear = $('#modal-clear-confirm');
    const btnCloseClearModal = $('#btn-close-clear-modal');
    const btnCancelClear = $('#btn-cancel-clear');
    const btnConfirmClear = $('#btn-confirm-clear');

    if (btnClearAll && modalClear) {
      btnClearAll.addEventListener('click', () => modalClear.classList.add('active'));
    }

    if (btnCloseClearModal) {
      btnCloseClearModal.addEventListener('click', () => this.closeClearModal());
    }

    if (btnCancelClear) {
      btnCancelClear.addEventListener('click', () => this.closeClearModal());
    }

    if (modalClear) {
      modalClear.addEventListener('click', (e) => {
        if (e.target === modalClear) this.closeClearModal();
      });
    }

    if (btnConfirmClear) {
      btnConfirmClear.addEventListener('click', () => this.executeClearAllData());
    }
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
    a.download = `habitpulse_backup_${todayStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    DashboardController.showToast('Data exported successfully JSON', 'success');
  },

  handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const result = StorageEngine.importData(parsed);

        if (result.success) {
          DashboardController.render();
          this.render();
          DashboardController.showToast('Data imported successfully!', 'success');
        } else {
          DashboardController.showToast(result.error || 'Import failed', 'error');
        }
      } catch (err) {
        DashboardController.showToast('Invalid JSON file format', 'error');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  },

  executeClearAllData() {
    StorageEngine.clearAllData();
    this.closeClearModal();
    DashboardController.render();
    this.render();
    DashboardController.showToast('All data cleared successfully', 'error');
  },

  render() {
    // Sync Radio States with Storage
    const currentTheme = StorageEngine.getTheme();
    const currentUnit = StorageEngine.getUnits();

    const themeRadio = $(`input[name="setting-theme"][value="${currentTheme}"]`);
    if (themeRadio) themeRadio.checked = true;

    const unitRadio = $(`input[name="setting-unit"][value="${currentUnit}"]`);
    if (unitRadio) unitRadio.checked = true;
  }
};
