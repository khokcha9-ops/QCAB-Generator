// Array of preset files you want to load automatically
const PRESET_FILES = [
  './presets/gs1.json'
  // Add others here later, e.g., './presets/gs2.json'
];

// Key used in LocalStorage
const STORAGE_KEY = 'question_bank_data';

// 1. Function to fetch JSON safely
async function fetchPresetData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Could not load preset from ${url}:`, err);
    return [];
  }
}

// 2. Auto-load presets on page startup
async function initQuestionBank() {
  let existingData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // Fetch all listed preset files in parallel
  const presetResults = await Promise.all(PRESET_FILES.map(fetchPresetData));
  const allPresets = presetResults.flat();

  // Combine local data with presets (avoiding duplicates if questions have unique IDs)
  const existingIds = new Set(existingData.map(q => q.id));
  const newPresets = allPresets.filter(q => q.id && !existingIds.has(q.id));

  if (newPresets.length > 0) {
    existingData = [...existingData, ...newPresets];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
  }

  // Update UI stats & render
  updateBankUI(existingData);
}

// 3. UI Helper to show question count and render search results
function updateBankUI(questions) {
  const countElement = document.getElementById('bank-count');
  if (countElement) {
    countElement.textContent = `Current Bank Size: ${questions.length} question(s) stored in browser memory.`;
  }
  // Trigger your existing display/rendering function here
}

// Run initialization automatically when DOM is ready
document.addEventListener('DOMContentLoaded', initQuestionBank);
