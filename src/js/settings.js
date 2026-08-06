/**
 * HabitPulse Streamlined Settings Controller
 */
import { StorageEngine } from './storage.js';
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
    // 1. Profil: Nama Tampilan
    const displayNameInput = $('#setting-display-name');
    if (displayNameInput) {
      displayNameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim() || 'Athlete';
        StorageEngine.updateSetting('profile', 'displayName', val);
        DashboardController.renderGreeting();
      });
    }

    // 2. Tampilan: Tema (Dark, Light, System)
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

    // 3. Preferensi Aktivitas: Satuan Jarak & Aktivitas Default
    const unitSelect = $('#setting-unit-select');
    if (unitSelect) {
      unitSelect.addEventListener('change', (e) => {
        StorageEngine.saveUnits(e.target.value);
        this.reRenderAllControllers();
      });
    }

    const defaultActivitySelect = $('#setting-default-activity');
    if (defaultActivitySelect) {
      defaultActivitySelect.addEventListener('change', (e) => {
        StorageEngine.updateSetting('profile', 'defaultActivity', e.target.value);
      });
    }

    // 4. Data: Ekspor, Impor, Hapus Semua Data
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

    // 1. Profil
    const displayNameInput = $('#setting-display-name');
    if (displayNameInput) displayNameInput.value = settings.profile.displayName || 'Athlete';

    // 2. Tampilan
    const themeBtns = $$('.theme-btn');
    themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === settings.appearance.theme);
    });

    // 3. Preferensi Aktivitas
    const unitSelect = $('#setting-unit-select');
    if (unitSelect) unitSelect.value = settings.activity.unit || 'km';

    const defaultActivitySelect = $('#setting-default-activity');
    if (defaultActivitySelect) defaultActivitySelect.value = settings.profile.defaultActivity || 'running';
  }
};


