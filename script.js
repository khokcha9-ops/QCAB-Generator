async function loadRepositoryJSON() {
  const STORAGE_KEY = 'qcab_preset_bank';
  
  try {
    const res = await fetch('./all_pyq.json');
    if (!res.ok) throw new Error('File not found');
    const data = await res.json();
    const fetchedQuestions = Array.isArray(data) ? data : (data.questions || data.bank || []);

    // Get what is currently saved in browser memory (keeping your custom entries safe)
    let storedQuestions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // Deduplicate and merge new questions
    const existingIds = new Set(storedQuestions.map(q => q.id));
    const newQuestions = fetchedQuestions.filter(q => q.id && !existingIds.has(q.id));

    if (newQuestions.length > 0) {
      storedQuestions = [...storedQuestions, ...newQuestions];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedQuestions));
    }

    presetBank = storedQuestions;
    if (typeof updateBankStatus === 'function') updateBankStatus();
    if (typeof populateFilterYears === 'function') populateFilterYears();
    if (typeof populateFilterTopics === 'function') populateFilterTopics();

  } catch (err) {
    console.warn('Could not load all_pyq.json:', err);
  }
}
