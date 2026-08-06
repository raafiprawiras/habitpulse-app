/**
 * HabitPulse Form Input Validation Engine
 */

export const Validator = {
  /**
   * Validate activity form data
   * @param {Object} data 
   * @returns {{isValid: boolean, errors: Object<string, string>}}
   */
  validateActivity(data) {
    const errors = {};

    // Validate Activity Type
    const validTypes = ['running', 'cycling', 'walking', 'workout'];
    if (!data.type || !validTypes.includes(data.type)) {
      errors.type = 'Pilih jenis aktivitas olahraga yang valid.';
    }

    // Validate Title
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
      errors.title = 'Judul aktivitas minimal 3 karakter.';
    }

    // Validate Date
    if (!data.date) {
      errors.date = 'Pilih tanggal aktivitas.';
    } else {
      const selectedDate = new Date(data.date);
      if (isNaN(selectedDate.getTime())) {
        errors.date = 'Format tanggal tidak valid.';
      }
    }

    // Validate Duration
    const duration = Number(data.duration);
    if (isNaN(duration) || duration <= 0) {
      errors.duration = 'Durasi harus berupa angka positif (min 1 menit).';
    } else if (duration > 1440) {
      errors.duration = 'Durasi maksimal 1440 menit (24 jam).';
    }

    // Validate Distance (Required for running, cycling, walking)
    if (['running', 'cycling', 'walking'].includes(data.type)) {
      const distance = Number(data.distance);
      if (isNaN(distance) || distance <= 0) {
        errors.distance = 'Jarak tempuh harus berupa angka positif (min 0.1 km).';
      } else if (distance > 1000) {
        errors.distance = 'Jarak tempuh terlalu besar (maks 1000 km).';
      }
    }

    // Validate Intensity
    const validIntensities = ['light', 'moderate', 'intense'];
    if (data.intensity && !validIntensities.includes(data.intensity)) {
      errors.intensity = 'Pilih tingkat intensitas yang valid.';
    }

    // Validate Calories
    if (data.calories !== undefined && data.calories !== '') {
      const calories = Number(data.calories);
      if (isNaN(calories) || calories < 0) {
        errors.calories = 'Kalori terbakar tidak boleh negatif.';
      }
    }

    // Validate Heart Rate (Optional)
    if (data.heartRate !== undefined && data.heartRate !== '') {
      const hr = Number(data.heartRate);
      if (isNaN(hr) || hr < 30 || hr > 240) {
        errors.heartRate = 'Rata-rata HR harus antara 30 dan 240 bpm.';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};
