// Array of preset files you want to load automatically
const PRESET_FILES = [
  './gs1_pyq.json',
  './gs2_pyq.json'
];

// Key used in LocalStorage
const STORAGE_KEY = 'qcab_preset_bank';

// Function to fetch JSON safely
async function fetchPresetData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.questions || data.bank || []);
  } catch (err) {
    console.warn(`Optional file not found or skipped: ${url}`);
    return [];
  }
}

// Auto-load presets on page startup
async function loadRepositoryJSON() {
  try {
    // Fetch all listed preset files in parallel
    const presetResults = await Promise.all(PRESET_FILES.map(fetchPresetData));
    const allPresets = presetResults.flat();

    if (allPresets.length > 0) {
      processIncomingArray(allPresets);
    } else {
      updateBankStatus();
    }
  } catch (err) {
    console.warn('Fetch failed: check local server or file paths');
    updateBankStatus();
  }
}

// Run auto-loader when DOM is ready
document.addEventListener('DOMContentLoaded', loadRepositoryJSON);
