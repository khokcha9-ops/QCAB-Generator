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
// Add paths to your presets here. When you finish GS 2 or GS 3, just add them to this array!
const PRESET_FILES = [
  './presets/gs1.json'
];

const LOCAL_STORAGE_KEY = 'preset_question_bank';

// Fetch a single JSON preset file safely
async function fetchPresetFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn(`Failed to fetch ${url}:`, err);
    return [];
  }
}

// Auto-load presets and merge them with browser storage
async function loadAutoPresets() {
  // 1. Fetch all remote preset JSON files simultaneously
  const fetchPromises = PRESET_FILES.map(url => fetchPresetFile(url));
  const presetResults = await Promise.all(fetchPromises);
  const fetchedQuestions = presetResults.flat();

  // 2. Retrieve any custom questions stored in local storage
  let storedQuestions = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

  // 3. Deduplicate (prevent re-adding items already in storage)
  const existingIds = new Set(storedQuestions.map(q => q.id));
  const newQuestions = fetchedQuestions.filter(q => q.id && !existingIds.has(q.id));

  // 4. Update local state
  const updatedBank = [...storedQuestions, ...newQuestions];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedBank));

  // 5. Update the UI text & render full list
  renderBankStatus(updatedBank.length);
  return updatedBank;
}

// Update the "Current Bank Size" paragraph dynamically
function renderBankStatus(count) {
  const statusEl = document.querySelector('.bank-status-text'); // update selector to match your HTML
  if (statusEl) {
    statusEl.textContent = `Current Bank Size: ${count} question(s) stored in browser memory.`;
  }
}

// Run auto-loader as soon as the DOM finishes loading
document.addEventListener('DOMContentLoaded', async () => {
  const allQuestions = await loadAutoPresets();
  
  // Call your existing search/display function here to populate results on screen:
  // displayQuestions(allQuestions); 
});
