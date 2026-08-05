/**
 * HabitPulse Helper Utilities
 */

/**
 * Query selector shortcut
 * @param {string} selector 
 * @param {Element|Document} [parent=document] 
 * @returns {Element|null}
 */
export const $ = (selector, parent = document) => parent.querySelector(selector);

/**
 * Query selector all shortcut
 * @param {string} selector 
 * @param {Element|Document} [parent=document] 
 * @returns {NodeListOf<Element>}
 */
export const $$ = (selector, parent = document) => parent.querySelectorAll(selector);

/**
 * Format date string into human-readable Indonesian format
 * @param {string} dateString YYYY-MM-DD
 * @returns {string} e.g. "Senin, 5 Agt 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
}

/**
 * Format duration minutes into "1j 30m" or "45m"
 * @param {number} totalMinutes 
 * @returns {string}
 */
export function formatDuration(totalMinutes) {
  const mins = Number(totalMinutes) || 0;
  if (mins < 60) {
    return `${mins}m`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours}j ${remainingMins}m` : `${hours}j`;
}

/**
 * Format distance in KM or Miles based on user preference
 * @param {number} distanceKm 
 * @param {string} [unit='km'] 'km' | 'miles'
 * @returns {string}
 */
export function formatDistance(distanceKm, unit = 'km') {
  const km = Number(distanceKm) || 0;
  if (unit === 'miles') {
    const miles = km * 0.621371;
    return `${miles.toFixed(2)} mi`;
  }
  return `${km.toFixed(2)} km`;
}

/**
 * Calculate pace in minutes per km or miles
 * @param {number} durationMins 
 * @param {number} distanceKm 
 * @param {string} [unit='km']
 * @returns {string} e.g. "5'30\" /km" or "8'50\" /mi"
 */
export function calculatePace(durationMins, distanceKm, unit = 'km') {
  const mins = Number(durationMins) || 0;
  let dist = Number(distanceKm) || 0;

  if (mins <= 0 || dist <= 0) return '-';

  if (unit === 'miles') {
    dist = dist * 0.621371;
  }

  const paceDecimal = mins / dist;
  const paceMins = Math.floor(paceDecimal);
  const paceSecs = Math.round((paceDecimal - paceMins) * 60);

  const formattedSecs = paceSecs < 10 ? `0${paceSecs}` : `${paceSecs}`;
  const unitLabel = unit === 'miles' ? '/mi' : '/km';
  return `${paceMins}'${formattedSecs}" ${unitLabel}`;
}

/**
 * Estimate calories burned based on activity type, duration, distance, and intensity
 * @param {string} type 
 * @param {number} durationMins 
 * @param {number} distanceKm 
 * @param {string} [intensity='moderate'] 'light' | 'moderate' | 'intense'
 * @returns {number}
 */
export function estimateCalories(type, durationMins, distanceKm, intensity = 'moderate') {
  const mins = Number(durationMins) || 0;
  const dist = Number(distanceKm) || 0;

  if (mins <= 0) return 0;

  // Base MET values for standard sport types
  const baseMETs = {
    running: 10.0,
    cycling: 8.0,
    walking: 4.5,
    workout: 6.5
  };

  const intensityMultipliers = {
    light: 0.8,
    moderate: 1.0,
    intense: 1.25
  };

  const met = baseMETs[type] || 6.0;
  const multiplier = intensityMultipliers[intensity] || 1.0;

  // Standard calculation: (Duration in hours) * MET * Multiplier * 70kg average weight
  let cal = (mins / 60) * met * multiplier * 70;

  // Add bonus for distance
  if (dist > 0 && type !== 'workout') {
    cal += dist * 12;
  }

  return Math.round(cal);
}

/**
 * Check if a date string falls in the current calendar week (Monday to Sunday)
 * @param {string} dateString YYYY-MM-DD
 * @returns {boolean}
 */
export function isDateInCurrentWeek(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;

  const now = new Date();
  
  // Get Monday of current week
  const day = now.getDay();
  const diffToMon = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diffToMon));
  monday.setHours(0, 0, 0, 0);

  // Get Sunday of current week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return date >= monday && date <= sunday;
}

/**
 * Generate unique random ID for activity records
 * @returns {string}
 */
export function generateUniqueId() {
  return 'act_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
}

/**
 * Sanitize string to prevent XSS attacks
 * @param {string} str 
 * @returns {string}
 */
export function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Get greeting string based on current client device time
 * @returns {string}
 */
export function getGreetingByTime() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}
