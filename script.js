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

function normalizePaperCode(paperVal) {
  if (!paperVal) return 'GS1';
  const str = String(paperVal).toUpperCase().replace(/[\s\-_]/g, '');
  if (str.includes('GS1') || str.includes('PAPER1')) return 'GS1';
  if (str.includes('GS2') || str.includes('PAPER2')) return 'GS2'; // Ensures GS2 is recognized
  if (str.includes('GS3') || str.includes('PAPER3')) return 'GS3';
  if (str.includes('GS4') || str.includes('PAPER4')) return 'GS4';
  if (str.includes('OPT1')) return 'OPT1';
  if (str.includes('OPT2')) return 'OPT2';
  return 'GS1';
}
