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
async function fetchPresetData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    
    // Handles array, or objects containing questions/bank arrays
    if (Array.isArray(data)) return data;
    return data.questions || data.bank || data.data || [];
  } catch (err) {
    console.warn(`Could not load preset from ${url}:`, err);
    return [];
  }
}
// Safe merge loading function to prevent deleting custom data/subtopics
async function loadRepositoryJSON() {
  const STORAGE_KEY = 'qcab_preset_bank'; // Matches your app's storage key
  
  // 1. Fetch JSON safely helper
  const fetchSafe = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : (data.questions || data.bank || data.data || []);
    } catch (e) {
      console.warn(`Optional file skipped: ${url}`);
      return [];
    }
  };

  try {
    // 2. Fetch both GS1 and GS2 (add any other files here if needed)
    const [res1, res2] = await Promise.all([
      fetchSafe('./gs1_pyq.json'),
      fetchSafe('./gs2_pyq.json')
    ]);
    const fetchedQuestions = [...res1, ...res2];

    // 3. Get what is currently saved in browser memory (including your custom/anthropology entries)
    let storedQuestions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // 4. Only add new items if they don't already exist, keeping everything else safe
    const existingIds = new Set(storedQuestions.map(q => q.id));
    const newQuestions = fetchedQuestions.filter(q => q.id && !existingIds.has(q.id));

    if (newQuestions.length > 0) {
      storedQuestions = [...storedQuestions, ...newQuestions];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedQuestions));
    }

    // 5. Load into your app's global presetBank variable
    presetBank = storedQuestions;
    if (typeof updateBankStatus === 'function') updateBankStatus();
    if (typeof populateFilterYears === 'function') populateFilterYears();
    if (typeof populateFilterTopics === 'function') populateFilterTopics();

  } catch (err) {
    console.warn('Repository load error:', err);
    if (typeof updateBankStatus === 'function') updateBankStatus();
  }
}
// Robust paper code normalization to ensure GS2 is captured correctly
function normalizePaperCode(paperVal) {
  if (!paperVal) return 'GS1';
  const str = String(paperVal).toUpperCase().replace(/[\s\-_]/g, '');
  if (str.includes('GS2') || str.includes('PAPER2') || str.includes('GOVERNANCE') || str.includes('POLITY')) return 'GS2';
  if (str.includes('GS3') || str.includes('PAPER3')) return 'GS3';
  if (str.includes('GS4') || str.includes('PAPER4')) return 'GS4';
  if (str.includes('OPT')) return 'OPT1';
  return 'GS1'; // defaults or GS1 fallback
}

// Inside your filter execution code:
let filtered = presetBank.filter(q => {
  const normQPaper = normalizePaperCode(q.paper);
  const selectedPNormalized = normalizePaperCode(selectedP);
  
  if (selectedP !== 'ALL' && normQPaper !== selectedPNormalized) return false;
  if (selectedY !== 'ALL' && String(q.year).trim() !== String(selectedY).trim()) return false;
  
  if (!isYearMode && selectedT !== 'ALL') {
    const qTopicClean = String(q.topic || '').trim().toLowerCase();
    const selectedTClean = String(selectedT).trim().toLowerCase();
    if (!qTopicClean.includes(selectedTClean)) return false;
  }
  return true;
});
