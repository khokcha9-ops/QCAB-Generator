// ============================================================
// CUSTOM MODAL SYSTEM
// ============================================================
async function showAlert(message, title = 'Notice') {
  return new Promise((resolve) => {
    const overlay = document.getElementById('customModal');
    if (!overlay) { alert(message); resolve(); return; }
    const titleEl = document.getElementById('modalTitle');
    const messageEl = document.getElementById('modalMessage');
    const inputContainer = document.getElementById('modalInputContainer');
    const confirmBtn = document.getElementById('modalConfirmBtn');
    const cancelBtn = document.getElementById('modalCancelBtn');

    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    if (inputContainer) inputContainer.style.display = 'none';
    if (confirmBtn) {
      confirmBtn.textContent = 'OK';
      confirmBtn.className = 'btn btn-primary';
      confirmBtn.onclick = function() { overlay.classList.remove('active'); resolve(); };
    }
    if (cancelBtn) cancelBtn.style.display = 'none';
    overlay.classList.add('active');
    confirmBtn?.focus();
  });
}

async function showConfirm(message, title = 'Confirm') {
  return new Promise((resolve) => {
    const overlay = document.getElementById('customModal');
    if (!overlay) { resolve(confirm(message)); return; }
    const titleEl = document.getElementById('modalTitle');
    const messageEl = document.getElementById('modalMessage');
    const inputContainer = document.getElementById('modalInputContainer');
    const confirmBtn = document.getElementById('modalConfirmBtn');
    const cancelBtn = document.getElementById('modalCancelBtn');

    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    if (inputContainer) inputContainer.style.display = 'none';
    if (confirmBtn) {
      confirmBtn.textContent = 'OK';
      confirmBtn.className = 'btn btn-primary';
      confirmBtn.onclick = function() { overlay.classList.remove('active'); resolve(true); };
    }
    if (cancelBtn) {
      cancelBtn.style.display = 'inline-block';
      cancelBtn.className = 'btn btn-secondary';
      cancelBtn.onclick = function() { overlay.classList.remove('active'); resolve(false); };
    }
    overlay.classList.add('active');
    confirmBtn?.focus();
  });
}

async function showPrompt(message, title = 'Enter Value', defaultValue = '') {
  return new Promise((resolve) => {
    const overlay = document.getElementById('customModal');
    if (!overlay) { resolve(prompt(message, defaultValue)); return; }
    const titleEl = document.getElementById('modalTitle');
    const messageEl = document.getElementById('modalMessage');
    const inputContainer = document.getElementById('modalInputContainer');
    const inputEl = document.getElementById('modalInput');
    const confirmBtn = document.getElementById('modalConfirmBtn');
    const cancelBtn = document.getElementById('modalCancelBtn');

    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    if (inputContainer) inputContainer.style.display = 'block';
    if (inputEl) inputEl.value = defaultValue || '';
    if (confirmBtn) {
      confirmBtn.textContent = 'OK';
      confirmBtn.className = 'btn btn-primary';
      confirmBtn.onclick = function() { overlay.classList.remove('active'); resolve(inputEl ? inputEl.value : ''); };
    }
    if (cancelBtn) {
      cancelBtn.style.display = 'inline-block';
      cancelBtn.className = 'btn btn-secondary';
      cancelBtn.onclick = function() { overlay.classList.remove('active'); resolve(null); };
    }
    overlay.classList.add('active');
    inputEl?.focus();
    inputEl?.select();
  });
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('customModal');
    if (overlay?.classList.contains('active')) {
      overlay.classList.remove('active');
    }
  }
});

// Close modal on backdrop click (Placed outside DOMContentLoaded so it runs early)
document.getElementById('customModal')?.addEventListener('click', function(e) {
  if (e.target === this) this.classList.remove('active');
});

// ============================================================
// TOAST & UTILITIES
// ============================================================
function showToast(message, icon = '✅') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMessage');
  const iconEl = document.getElementById('toastIcon');
  if (!toast) return;
  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  if (iconEl) iconEl.textContent = icon;
  if (msgEl) msgEl.textContent = message;
  toast.classList.add('show');
  window.toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(text); return; } catch (err) { console.warn('Clipboard API failed', err); }
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try { document.execCommand('copy'); } finally { textarea.remove(); }
}

function generateFullPrompt(question) {
  return `You are an expert UPSC Civil Services model answer writer. Generate a high-quality answer of about 500 words for the following question with introduction, body, and conclusion. Use recent facts and examples. Question: "${question}"`;
}

function generatePerplexityQuery(question) {
  return generateFullPrompt(question);
}

console.log('✅ Custom modal + toast system loaded');

// ============================================================
// MAIN APP
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 App.js loaded');
    // FILTER TAB SWITCHER (Fix for Subtopic)
  const filterByYearBtn = document.getElementById('btn-filter-year');
  const filterBySubtopicBtn = document.getElementById('btn-filter-subtopic');
  const filterYearSelect = document.getElementById('filter-year');
  const filterTopicSelect = document.getElementById('filter-topic');

  if (filterByYearBtn && filterBySubtopicBtn) {
    filterByYearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      filterByYearBtn.classList.add('active');
      filterBySubtopicBtn.classList.remove('active');
      if (filterYearSelect) filterYearSelect.style.display = 'block';
      if (filterTopicSelect) filterTopicSelect.style.display = 'none';
      if (filterTopicSelect) filterTopicSelect.value = 'ALL';
      renderBankResults();
    });

    filterBySubtopicBtn.addEventListener('click', (e) => {
      e.preventDefault();
      filterBySubtopicBtn.classList.add('active');
      filterByYearBtn.classList.remove('active');
      if (filterTopicSelect) filterTopicSelect.style.display = 'block';
      if (filterYearSelect) filterYearSelect.style.display = 'none';
      if (filterYearSelect) filterYearSelect.value = 'ALL';
      renderBankResults();
    });
  }

  // Safely define fallbacks for external global variables if missing
  window.SYLLABUS = window.SYLLABUS || { 'GS1': ['General'], 'GS2': ['General'], 'GS3': ['General'], 'GS4': ['General'], 'OPT1': ['General'], 'OPT2': ['General'] };
  window.MARK_RULES = window.MARK_RULES || { 10: 2, 15: 3, 20: 4 };
  window.WORKER_URL = window.WORKER_URL || '';

  // 1. NAVIGATION
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.scroll;
      const target = document.getElementById(id);
      if (target) {
        const offset = window.innerWidth <= 820 ? 70 : 10;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.scrollBy(0, -offset);
      }
      document.querySelectorAll('.nav-btn[data-scroll]').forEach(n => n.classList.remove('active'));
      const match = document.querySelector(`.nav-btn[data-scroll="${id}"]`);
      if (match) match.classList.add('active');
    });
  });

  // 2. THEME
  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('qcab_theme', theme);
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');
    const mobileIcon = document.getElementById('mobile-theme-toggle');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    if (text) text.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    if (mobileIcon) mobileIcon.textContent = isDark ? '☀️' : '🌙';
  }

  const savedTheme = localStorage.getItem('qcab_theme') || 'light';
  applyTheme(savedTheme);

  ['theme-toggle', 'mobile-theme-toggle', 'sidebar-theme'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      applyTheme(isDark ? 'light' : 'dark');
    });
  });

  // 3. MOBILE MENU
  (function() {
    const sidebar = document.getElementById('main-sidebar');
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('mobile-menu-close');
    const backdrop = document.getElementById('mobile-backdrop');
    if (!sidebar || !toggleBtn) return;

    function openMenu() {
      sidebar.classList.add('mobile-open');
      if (backdrop) backdrop.classList.add('active');
      document.body.classList.add('menu-open');
    }
    function closeMenu() {
      sidebar.classList.remove('mobile-open');
      if (backdrop) backdrop.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
    toggleBtn.addEventListener('click', openMenu);
    closeBtn?.addEventListener('click', closeMenu);
    backdrop?.addEventListener('click', closeMenu);
  })();

  // 4. BANK COLLAPSE
  const toggleBankBtn = document.getElementById('toggle-bank-btn');
  const toggleBankIcon = document.getElementById('toggle-bank-icon');
  const toggleBankText = document.getElementById('toggle-bank-text');
  const bankBody = document.getElementById('pyq-bank-body');

  if (bankBody) bankBody.style.display = 'block';
  if (toggleBankIcon) toggleBankIcon.textContent = '▾';
  if (toggleBankText) toggleBankText.textContent = 'Hide Bank';

  if (toggleBankBtn && bankBody) {
    toggleBankBtn.addEventListener('click', () => {
      const isHidden = bankBody.style.display === 'none';
      bankBody.style.display = isHidden ? 'block' : 'none';
      if (toggleBankIcon) toggleBankIcon.textContent = isHidden ? '▾' : '▸';
      if (toggleBankText) toggleBankText.textContent = isHidden ? 'Hide Bank' : 'Show Bank';
    });
  }

  // 5. CREATE FORM COLLAPSE
  const toggleCreateBtn = document.getElementById('toggle-create-section-btn');
  const createFormBody = document.getElementById('create-form-body');
  if (toggleCreateBtn && createFormBody) {
    toggleCreateBtn.addEventListener('click', () => {
      const isHidden = createFormBody.style.display === 'none';
      createFormBody.style.display = isHidden ? 'block' : 'none';
      toggleCreateBtn.textContent = isHidden ? 'Hide Form ▾' : 'Show Form ▸';
    });
  }

  // 6. POPULATE FORM SUBTOPICS
  function populateFormSubtopics() {
    const qPaper = document.getElementById('q-paper');
    const qTopic = document.getElementById('q-topic');
    if (!qTopic || !qPaper) return;
    qTopic.innerHTML = '';
    const paper = qPaper.value;
    const list = SYLLABUS[paper] || ['General'];
    list.forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      qTopic.appendChild(opt);
    });
  }
  document.getElementById('q-paper')?.addEventListener('change', populateFormSubtopics);
  populateFormSubtopics();

  // 7. DASHBOARD SYNC
  function syncDashboard() {
    const qList = document.getElementById('q-list');
    const count = qList ? qList.querySelectorAll('.q-item').length : 0;
    const pages = document.getElementById('total-pages')?.textContent || '0';
    const bankStatus = document.getElementById('bank-status-text')?.textContent || '';
    const nums = bankStatus.match(/\d+/);
    const bankCount = nums ? nums[0] : '—';

    const qCount = document.getElementById('dashboard-q-count');
    const pageCount = document.getElementById('dashboard-pages');
    const bankCountEl = document.getElementById('dashboard-bank-count');
    if (qCount) qCount.textContent = count;
    if (pageCount) pageCount.textContent = pages;
    if (bankCountEl) bankCountEl.textContent = bankCount;
  }

  // 8. SCROLL TO TOP
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });
  backToTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // 9. HELPER FUNCTIONS
  function normalizePaperCode(paperVal) {
    if (!paperVal) return 'GS1';
    const str = String(paperVal).toUpperCase().trim();
    if (str === 'GS1' || str === 'GS PAPER 1') return 'GS1';
    if (str === 'GS2' || str === 'GS PAPER 2') return 'GS2';
    if (str === 'GS3' || str === 'GS PAPER 3') return 'GS3';
    if (str === 'GS4' || str === 'GS PAPER 4') return 'GS4';
    if (str.includes('OPT1') || str.includes('ANTHROPOLOGY OPTIONAL PAPER 1')) return 'OPT1';
    if (str.includes('OPT2') || str.includes('ANTHROPOLOGY OPTIONAL PAPER 2')) return 'OPT2';
    return 'GS1';
  }

  function getPaperTagClass(paper) {
    const norm = normalizePaperCode(paper);
    const classes = { 'GS1': 'tag-paper-gs1', 'GS2': 'tag-paper-gs2', 'GS3': 'tag-paper-gs3', 'GS4': 'tag-paper-gs4' };
    return classes[norm] || 'tag-paper-opt';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (m) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[m];
    });
  }

  function generateUniqueId(prefix = 'id') {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}_${crypto.randomUUID()}`;
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  function getYearGroup(q) {
    if (q.yearGroup && q.yearGroup !== 'Other') return q.yearGroup;
    const raw = String(q.year || '').trim();
    const match = raw.match(/\b(19\d{2}|20\d{2})\b/);
    const y = match ? Number(match[1]) : NaN;
    if (Number.isInteger(y) && y >= 2013 && y <= 2026) return String(y);
    return 'Other';
  }

  // 10. STORAGE & STATE
  const PRESET_STORAGE_KEY = 'qcab_preset_bank';
  const VERSION_KEY = 'qcab_data_version';
  const CURRENT_VERSION = '3';

  let presetBank = [];
  if (localStorage.getItem(VERSION_KEY) !== CURRENT_VERSION) {
    localStorage.removeItem(PRESET_STORAGE_KEY);
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    presetBank = [];
  } else {
    presetBank = JSON.parse(localStorage.getItem(PRESET_STORAGE_KEY)) || [];
  }

  let studyData = {};
  let editingIndex = null;

  // 11. FOLDER & BOOKLET STATE
  const defaultRoot = { id: 'root', name: 'General Booklet', parentId: null, subfolders: [], questions: [] };
  let folderMap = JSON.parse(localStorage.getItem('qcab_nested_folders')) || { root: defaultRoot };
  let activeFolderId = localStorage.getItem('qcab_active_nested_folder') || 'root';
  if (!folderMap[activeFolderId]) activeFolderId = 'root';

  function saveState() {
    localStorage.setItem('qcab_nested_folders', JSON.stringify(folderMap));
    localStorage.setItem('qcab_active_nested_folder', activeFolderId);
  }

  function getActiveFolder() {
    return folderMap[activeFolderId] || folderMap['root'];
  }

  // 12. DOM REFERENCES
  const qPaper = document.getElementById('q-paper');
  const qTopic = document.getElementById('q-topic');
  const qText = document.getElementById('q-text');
  const qYear = document.getElementById('q-year');
  const addBtn = document.getElementById('add-btn');
  const addPresetBtn = document.getElementById('add-preset-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const marksButtons = document.querySelectorAll('.marks-btn');
  const qList = document.getElementById('q-list');
  const emptyState = document.getElementById('empty-state');
  const countTag = document.getElementById('count-tag');
  const summaryBar = document.getElementById('summary-bar');
  const totalMarksEl = document.getElementById('total-marks');
  const totalPagesEl = document.getElementById('total-pages');
  const generateBtn = document.getElementById('generate-btn');
  const renameFolderBtn = document.getElementById('rename-folder-btn');
  const deleteFolderBtn = document.getElementById('delete-folder-btn');
  const clearQBtn = document.getElementById('clear-q-btn');
  const clearBankBtn = document.getElementById('clear-bank-btn');
  const searchInput = document.getElementById('search-input');
  const filterPaper = document.getElementById('filter-paper');
  const filterYear = document.getElementById('filter-year');
  const filterTopic = document.getElementById('filter-topic');
  const searchBankBtn = document.getElementById('search-bank-btn');
  const clearResultsBtn = document.getElementById('clear-results-btn');
  const bankResultsContainer = document.getElementById('bank-results-container');
  const bankStatusText = document.getElementById('bank-status-text');

  let selectedMarks = 10;
  if (marksButtons.length > 0) marksButtons[0].setAttribute('aria-pressed', 'true');
  marksButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedMarks = parseInt(btn.dataset.marks, 10);
      marksButtons.forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
    });
  });

  // 13. STUDY DATA FUNCTIONS
  function getStudyRecord(q) {
    const id = q.id || q.question;
    if (!studyData[id]) studyData[id] = { bookmarked: false, revised: false, note: '' };
    return studyData[id];
  }

  function updateStudyDashboard() {
    let bookmarked = 0, revised = 0, withNotes = 0;
    const listContainer = document.getElementById('study-list-container');
    if (!listContainer) return;
    const items = [];

    presetBank.forEach(q => {
      const id = q.id;
      if (studyData[id] && studyData[id].bookmarked) {
        bookmarked++;
        if (studyData[id].revised) revised++;
        if (studyData[id].note && studyData[id].note.trim()) withNotes++;
        items.push(q);
      }
    });

    const bmEl = document.getElementById('study-bookmarked');
    const revEl = document.getElementById('study-revised');
    const notesEl = document.getElementById('study-notes');

    if (bmEl) bmEl.textContent = bookmarked;
    if (revEl) revEl.textContent = revised;
    if (notesEl) notesEl.textContent = withNotes;

    // SIDEBAR PROGRESS TRACKER
    const sbBookmarked = document.getElementById('sidebar-bookmarked');
    const sbRevised = document.getElementById('sidebar-revised');
    const sbNotes = document.getElementById('sidebar-notes');
    const sbProgress = document.getElementById('sidebar-progress');

    if (sbBookmarked) sbBookmarked.textContent = bookmarked;
    if (sbRevised) sbRevised.textContent = revised;
    if (sbNotes) sbNotes.textContent = withNotes;

    const user = window.getUser ? window.getUser() : null;
    if (sbProgress && user) {
        sbProgress.style.display = 'block';
    } else if (sbProgress) {
        sbProgress.style.display = 'none';
    }

    if (items.length === 0) {
      listContainer.innerHTML = '<p style="color:var(--muted);font-style:italic;">You haven\'t bookmarked any questions yet. Use the ⭐ button on any question to start.</p>';
      return;
    }

    let html = '<div style="display:grid;gap:10px;">';
    items.forEach(q => {
      const rec = getStudyRecord(q);
      const status = rec.revised ? '✅ Revised' : '⏳ Not revised';
      const notePreview = rec.note ? rec.note.substring(0, 60) + (rec.note.length > 60 ? '…' : '') : 'No note';
      html += `
        <div style="border:1px solid var(--border);border-radius:10px;padding:12px;background:var(--surface-2);">
          <div style="font-weight:700;margin-bottom:4px;">${escapeHtml(q.question)}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;font-size:12px;">
            <span class="tag">${escapeHtml(q.paper)}</span>
            <span class="tag tag-topic">${escapeHtml(q.topic)}</span>
            <span class="tag">${q.year || ''}</span>
            <span class="tag">${status}</span>
            <span class="tag">📝 ${notePreview}</span>
          </div>
        </div>
      `;
    });
    html += '</div>';
    listContainer.innerHTML = html;
  }

  // 14. POPULATE FILTERS
  function populateFilterTopics() {
    if (!filterTopic || !filterPaper) return;
    filterTopic.innerHTML = '<option value="ALL">All Subtopics</option>';
    const paper = filterPaper.value;
    let list = [];
    if (paper === 'ALL') {
      Object.values(SYLLABUS).forEach(arr => list.push(...arr));
      list = [...new Set(list)];
    } else {
      list = SYLLABUS[paper] || [];
    }
    list.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t; filterTopic.appendChild(opt);
    });
  }

  function populateFilterYears() {
    if (!filterYear) return;
    const prevSelected = filterYear.value;
    filterYear.innerHTML = '<option value="ALL">All Years</option>';
    const years = new Set();
    presetBank.forEach(q => {
      const yg = getYearGroup(q);
      if (yg !== 'Other') years.add(yg);
    });
    for (let year = 2026; year >= 2013; year--) {
      const yr = String(year);
      if (years.has(yr)) {
        const opt = document.createElement('option');
        opt.value = yr; opt.textContent = yr; filterYear.appendChild(opt);
      }
    }
    const hasOther = presetBank.some(q => getYearGroup(q) === 'Other');
    if (hasOther) {
      const opt = document.createElement('option');
      opt.value = 'Other'; opt.textContent = 'Other (Before 2013 / Outside 2013–2026)'; filterYear.appendChild(opt);
    }
    if (prevSelected && filterYear.querySelector(`option[value="${prevSelected}"]`)) filterYear.value = prevSelected;
  }

  // 15. LOAD QUESTIONS FROM JSON
  async function fetchJSONFile(url) {
    try {
      const response = await fetch(url + '?t=' + Date.now());
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : data.questions || data.bank || data.data || [];
    } catch (err) { console.warn(`Could not load file from ${url}:`, err); return []; }
  }

  async function loadRepositoryJSON() {
    try {
      const [gs1Data, gs2Data, gs3Data, gs4Data, opt1Data, opt2Data] = await Promise.all([
        fetchJSONFile('./gs1_pyq.json'), fetchJSONFile('./gs2_pyq.json'), fetchJSONFile('./gs3_pyq.json'), fetchJSONFile('./gs4_pyq.json'), fetchJSONFile('./opt1_pyq.json'), fetchJSONFile('./opt2_pyq.json')
      ]);
      const incoming = [...gs1Data, ...gs2Data, ...gs3Data, ...gs4Data, ...opt1Data, ...opt2Data];
      const newQuestions = [];

      incoming.forEach((q) => {
        const questionText = (q.question || q.q_text || q.text || q.title || '').trim();
        if (!questionText || questionText.toLowerCase() === 'year' || questionText.toLowerCase() === 'syllabus') return;
        let rawMarks = q.marks || q.mark || 10;
        if (typeof rawMarks === 'string') rawMarks = parseInt(rawMarks.replace(/[^0-9]/g, ''), 10) || 10;
        const rawYearText = String(q.year || q.exam_year || q.Year || '').trim();
        const yearMatch = rawYearText.match(/\b(19\d{2}|20\d{2})\b/);
        const rawYear = yearMatch ? yearMatch[1] : 'Other';
        const yearNumber = rawYear === 'Other' ? NaN : Number(rawYear);
        const yearGroup = Number.isInteger(yearNumber) && yearNumber >= 2013 && yearNumber <= 2026 ? String(yearNumber) : 'Other';
        const rawPaper = q.paper || q.gs || q.subject || 'GS1';
        const rawTopic = q.topic || q.subtopic || q.category || SYLLABUS[normalizePaperCode(rawPaper)]?.[0] || 'General';
        const item = { id: q.id || generateUniqueId('q'), paper: normalizePaperCode(rawPaper), topic: String(rawTopic).trim(), year: rawYearText || rawYear, yearGroup: yearGroup, marks: Number(rawMarks), question: questionText };
        newQuestions.push(item);
      });

      const existingCustom = presetBank.filter(ex => !newQuestions.some(nq => nq.question.trim().toLowerCase() === ex.question.trim().toLowerCase()));
      presetBank = [...newQuestions, ...existingCustom];
      savePresets();
      populateFilterYears();
      populateFilterTopics();
      renderBankResults();
      updateBankStatus();
      updateStudyDashboard();
    } catch (err) { console.warn('Repository load error:', err); updateBankStatus(); }
  }

  function savePresets() { localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presetBank)); updateBankStatus(); }
  function updateBankStatus() { if (bankStatusText) bankStatusText.textContent = `Current Bank Size: ${presetBank.length} question(s) loaded.`; syncDashboard(); }

  // 16. RENDER BANK RESULTS
  let renderRequestId = 0;
  async function renderBankResults() {
    if (!bankResultsContainer) return;
    const requestId = ++renderRequestId;
    const selectedP = filterPaper ? filterPaper.value : 'ALL';
    const selectedY = filterYear ? filterYear.value : 'ALL';
    const selectedT = filterTopic ? filterTopic.value : 'ALL';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (requestId !== renderRequestId) return;
    bankResultsContainer.innerHTML = '';

    const filtered = presetBank.filter((q) => {
      const qText = `${q.question || ''} ${q.topic || ''} ${q.paper || ''} ${q.year || ''}`.toLowerCase();
      if (query && !qText.includes(query)) return false;
      if (selectedP !== 'ALL' && q.paper !== selectedP) return false;
      if (selectedY !== 'ALL' && getYearGroup(q) !== String(selectedY).trim()) return false;
      if (selectedT !== 'ALL') {
        const qTopicClean = String(q.topic || '').trim().toLowerCase();
        const selectedTClean = String(selectedT).trim().toLowerCase();
        if (!qTopicClean.includes(selectedTClean) && !selectedTClean.includes(qTopicClean)) return false;
      }
      return true;
    });

    const total = presetBank.length;
    const showing = filtered.length;
    const countMsg = document.createElement('div');
    countMsg.style.cssText = 'margin-bottom: 12px; font-weight: 600; color: var(--text); font-size: 14px;';
    countMsg.textContent = `Showing ${showing} of ${total} question${total > 1 ? 's' : ''}`;
    bankResultsContainer.appendChild(countMsg);

    if (filtered.length === 0) {
      const noResult = document.createElement('p');
      noResult.style.cssText = 'font-size:13px; color:var(--muted); font-style:italic;';
      noResult.textContent = 'No questions found matching this selection.';
      bankResultsContainer.appendChild(noResult);
      return;
    }

    filtered.forEach((q, index) => {
      const div = document.createElement('div');
      div.className = 'bank-item';
      const paperClass = getPaperTagClass(q.paper);
      const rec = getStudyRecord(q);
      const bookmarked = rec.bookmarked;
      const revised = rec.revised;
      const numberedQuestion = `<strong>${index + 1}.</strong> ${escapeHtml(q.question)}`;

      div.innerHTML = `
        <div class="bank-question">${numberedQuestion}</div>
        <div class="bank-bottom">
          <div class="tags">
            <span class="tag ${paperClass}">${escapeHtml(q.paper || 'GS1')}</span>
            <span class="tag tag-topic">${escapeHtml(q.topic || 'General')}</span>
            <span class="tag">${q.marks} M ${q.year ? '/ ' + escapeHtml(q.year) : ''}</span>
          </div>
          <div class="bank-actions" style="flex-wrap:wrap; gap:6px;">
            <button class="btn-study ${bookmarked ? 'active-bookmark' : ''}" data-action="bookmark" data-id="${q.id}">⭐ ${bookmarked ? 'Bookmarked' : 'Bookmark'}</button>
            <button class="btn-study ${revised ? 'active-revised' : ''}" data-action="revise" data-id="${q.id}">✅ ${revised ? 'Revised' : 'Mark Revised'}</button>
            <button class="btn-study note-btn" data-action="note" data-id="${q.id}">📝 Note</button>
            <button class="btn-secondary-sm btn-add-item">+ Add</button>
            <button class="btn-secondary-sm btn-direct-pdf">⚡ PDF</button>
            <button class="btn-secondary-sm btn-ai-answer btn-ai-highlight" onclick="window.fetchAIAnswer(this)">✨ AI</button>
          </div>
        </div>
      `;

      div.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.action;
          const id = btn.dataset.id;
          if (action === 'bookmark') {
            studyData[id] = studyData[id] || { bookmarked: false, revised: false, note: '' };
            studyData[id].bookmarked = !studyData[id].bookmarked;
            saveStudyData(); renderBankResults();
          } else if (action === 'revise') {
            studyData[id] = studyData[id] || { bookmarked: false, revised: false, note: '' };
            studyData[id].revised = !studyData[id].revised;
            saveStudyData(); renderBankResults();
          } else if (action === 'note') { openNoteModal(id); }
        });
      });

      div.querySelector('.btn-add-item').addEventListener('click', () => {
        getActiveFolder().questions.push({ question: q.question, marks: q.marks, year: q.year, paper: q.paper, topic: q.topic });
        saveState(); renderQuestions();
      });

      div.querySelector('.btn-direct-pdf').addEventListener('click', () => {
        getActiveFolder().questions.push({ question: q.question, marks: q.marks, year: q.year, paper: q.paper, topic: q.topic });
        saveState(); renderQuestions(); generatePDF();
      });

      bankResultsContainer.appendChild(div);
    });
  }

  // 17. NOTE MODAL
  let currentNoteId = null;
  function openNoteModal(id) {
    currentNoteId = id;
    const rec = studyData[id] || { note: '' };
    const textEl = document.getElementById('note-textarea');
    if (textEl) textEl.value = rec.note || '';
    document.getElementById('note-modal')?.classList.add('open');
  }
  function closeNoteModal() { document.getElementById('note-modal')?.classList.remove('open'); currentNoteId = null; }
  document.getElementById('note-cancel-btn')?.addEventListener('click', closeNoteModal);
  document.getElementById('note-save-btn')?.addEventListener('click', () => {
    if (currentNoteId) {
      const textEl = document.getElementById('note-textarea');
      const note = textEl ? textEl.value.trim() : '';
      studyData[currentNoteId] = studyData[currentNoteId] || { bookmarked: false, revised: false, note: '' };
      studyData[currentNoteId].note = note;
      saveStudyData(); closeNoteModal(); renderBankResults();
    }
  });
  document.getElementById('note-modal')?.addEventListener('click', function(e) { if (e.target === this) closeNoteModal(); });

  // 18. STUDY SAVE/LOAD
  async function saveStudyData() {
    const USER_TOKEN = localStorage.getItem('userToken') || localStorage.getItem('qcab_owner_key');
    if (!USER_TOKEN || !WORKER_URL) return;
    const keys = Object.keys(studyData);
    if (keys.length === 0) return;
    const saveRequests = keys.map(question_id => {
      const rec = studyData[question_id];
      if (!rec || typeof rec !== 'object') return Promise.resolve();
      return fetch(`${WORKER_URL}/api/study/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + USER_TOKEN },
        body: JSON.stringify({ question_id: question_id, bookmarked: rec.bookmarked ? 1 : 0, revised: rec.revised ? 1 : 0, note: rec.note || '' })
      }).catch(e => console.error('Failed to save to cloud for', question_id, e));
    });
    await Promise.all(saveRequests);
    updateStudyDashboard();
  }

  async function loadCloudStudy() {
    const USER_TOKEN = localStorage.getItem('userToken') || localStorage.getItem('qcab_owner_key');
    if (!USER_TOKEN || !WORKER_URL) return;
    try {
      const res = await fetch(WORKER_URL + '/api/study/get', { headers: { 'Authorization': 'Bearer ' + USER_TOKEN } });
      if (!res.ok) return;
      const data = await res.json();
      data.forEach(item => {
        studyData[item.question_id] = { bookmarked: item.bookmarked == 1, revised: item.revised == 1, note: item.note || '' };
      });
      updateStudyDashboard(); renderBankResults();
    } catch (e) { console.error('Failed to load study data from cloud', e); }
  }

  // 19. EXPORT/IMPORT STUDY DATA
  document.getElementById('export-study-btn')?.addEventListener('click', () => {
    const data = JSON.stringify(studyData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'qcab_study_data.json'; a.click(); URL.revokeObjectURL(url);
  });
  document.getElementById('import-study-btn')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = function(e) {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = function(ev) {
        try {
          const data = JSON.parse(ev.target.result);
          if (typeof data === 'object') { studyData = data; saveStudyData(); renderBankResults(); showToast('Study data imported successfully!', '📥'); }
          else showToast('Invalid file format.', '❌');
        } catch(err) { showToast('Error reading file.', '❌'); }
      };
      reader.readAsText(file);
    };
    input.click();
  });

  // 20. RENDER QUESTIONS
  function renderQuestions() {
    if (!qList) return;
    const questions = getActiveFolder().questions;
    qList.innerHTML = '';
    if (questions.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (summaryBar) summaryBar.style.display = 'none';
      if (generateBtn) generateBtn.disabled = true;
      if (countTag) countTag.textContent = '0 questions';
      syncDashboard(); return;
    }
    if (emptyState) emptyState.style.display = 'none';
    if (summaryBar) summaryBar.style.display = 'grid';
    if (generateBtn) generateBtn.disabled = false;
    if (countTag) countTag.textContent = questions.length + ' question(s)';
    let totalMarks = 0, totalPages = 0;
    questions.forEach((q, i) => {
      totalMarks += q.marks;
      totalPages += MARK_RULES[q.marks] || 2;
      const li = document.createElement('li');
      li.className = 'q-item';
      const paperClass = getPaperTagClass(q.paper);
      li.innerHTML = `
        <div class="q-num">${i+1}.</div>
        <div>
          <div class="q-text">${escapeHtml(q.question)}</div>
          <div class="q-meta">
            ${q.paper ? `<span class="tag ${paperClass}">${escapeHtml(q.paper)}</span>` : ''}
            ${q.topic ? `<span class="tag tag-topic">${escapeHtml(q.topic)}</span>` : ''}
            <span class="tag">${q.marks} M ${q.year ? '/ ' + escapeHtml(q.year) : ''}</span>
            <span class="tag pages">${MARK_RULES[q.marks] || 2} pages</span>
          </div>
        </div>
        <div class="q-actions">
          <button class="icon-btn" title="Edit" data-action="edit" data-i="${i}">✏️</button>
          <button class="icon-btn danger" title="Remove" data-action="remove" data-i="${i}">&#10005;</button>
        </div>
      `;
      qList.appendChild(li);
    });
    if (totalMarksEl) totalMarksEl.textContent = totalMarks;
    if (totalPagesEl) totalPagesEl.textContent = totalPages;

    qList.querySelectorAll('.icon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.i, 10);
        if (btn.dataset.action === 'edit') {
          const q = questions[i]; editingIndex = i;
          if (qText) qText.value = q.question;
          if (qYear) qYear.value = q.year || '';
          if (qPaper) qPaper.value = q.paper || 'GS1';
          populateFormSubtopics();
          if (qTopic) qTopic.value = q.topic || '';
          selectedMarks = q.marks;
          marksButtons.forEach(b => b.setAttribute('aria-pressed', parseInt(b.dataset.marks, 10) === q.marks ? 'true' : 'false'));
          const headingEl = document.getElementById('add-heading');
          if (headingEl) headingEl.textContent = 'Edit Question #' + (i+1);
          if (addBtn) addBtn.textContent = 'Update Question';
          if (cancelEditBtn) cancelEditBtn.style.display = 'block';
        } else if (btn.dataset.action === 'remove') {
          questions.splice(i, 1); saveState(); renderQuestions();
        }
      });
    });
    syncDashboard();
  }

  // 21. ADD/EDIT QUESTION
  function resetForm() {
    editingIndex = null;
    if (qText) qText.value = '';
    if (qYear) qYear.value = '';
    const headingEl = document.getElementById('add-heading');
    if (headingEl) headingEl.textContent = 'Create Custom Question';
    if (addBtn) addBtn.textContent = 'Add to Active Folder';
    if (cancelEditBtn) cancelEditBtn.style.display = 'none';
  }
  cancelEditBtn?.addEventListener('click', resetForm);
  addBtn?.addEventListener('click', () => {
    const text = qText ? qText.value.trim() : '';
    if (!text) { if (qText) qText.focus(); return; }
    const item = { question: text, marks: selectedMarks, year: qYear ? qYear.value.trim() : '', yearGroup: getYearGroup({ year: qYear ? qYear.value.trim() : '' }), paper: qPaper ? qPaper.value : 'GS1', topic: qTopic ? qTopic.value : 'General' };
    const currentFolder = getActiveFolder();
    if (editingIndex !== null) currentFolder.questions[editingIndex] = item; else currentFolder.questions.push(item);
    resetForm(); saveState(); renderQuestions();
  });
  addPresetBtn?.addEventListener('click', () => {
    const text = qText ? qText.value.trim() : '';
    if (!text) { if (qText) qText.focus(); return; }
    const newPreset = { id: generateUniqueId('p'), paper: qPaper ? qPaper.value : 'GS1', topic: qTopic ? qTopic.value : 'General', year: qYear ? qYear.value.trim() || '2025' : '2025', yearGroup: getYearGroup({ year: qYear ? qYear.value.trim() || '2025' : '2025' }), marks: selectedMarks, question: text };
    presetBank.push(newPreset); savePresets(); populateFilterYears(); populateFilterTopics(); showToast('Question saved to Preset Bank!', '📥'); resetForm(); renderBankResults();
  });

  // 22. FOLDER MANAGEMENT
  function renderBreadcrumbs() {
    const breadcrumbs = document.getElementById('breadcrumbs'); if (!breadcrumbs) return;
    breadcrumbs.innerHTML = ''; const path = []; let curr = getActiveFolder();
    while (curr) { path.unshift(curr); curr = curr.parentId ? folderMap[curr.parentId] : null; }
    path.forEach((f, idx) => {
      if (idx > 0) breadcrumbs.appendChild(document.createTextNode(' / '));
      const crumb = document.createElement('span'); crumb.className = 'crumb'; crumb.textContent = f.name;
      crumb.addEventListener('click', () => { activeFolderId = f.id; saveState(); renderAll(); });
      breadcrumbs.appendChild(crumb);
    });
  }
  function renderFolders() {
    const folderBar = document.getElementById('folder-bar'); if (!folderBar) return;
    folderBar.innerHTML = ''; const current = getActiveFolder();
    current.subfolders.forEach(subId => {
      const sub = folderMap[subId]; if (!sub) return;
      const tab = document.createElement('button'); tab.className = 'folder-tab'; tab.innerHTML = `📁 ${escapeHtml(sub.name)}`;
      tab.addEventListener('click', () => { activeFolderId = sub.id; saveState(); renderAll(); });
      folderBar.appendChild(tab);
    });
    const newBtn = document.createElement('button'); newBtn.className = 'btn-new-folder'; newBtn.textContent = '+ New Folder';
    newBtn.addEventListener('click', async () => {
      const name = await showPrompt(`Create subfolder under "${current.name}":`, 'Create Folder');
      if (name && name.trim()) {
        const newId = generateUniqueId('folder');
        folderMap[newId] = { id: newId, name: name.trim(), parentId: current.id, subfolders: [], questions: [] };
        current.subfolders.push(newId); activeFolderId = newId; saveState(); renderAll();
      }
    });
    folderBar.appendChild(newBtn);
  }
  renameFolderBtn?.addEventListener('click', async () => {
    const current = getActiveFolder(); if (current.id === 'root') { showToast('Cannot rename root folder.', '⚠️'); return; }
    const newName = await showPrompt('Rename folder:', 'Rename Folder', current.name);
    if (newName && newName.trim()) { current.name = newName.trim(); saveState(); renderAll(); }
  });
  deleteFolderBtn?.addEventListener('click', async () => {
    const current = getActiveFolder(); if (current.id === 'root') { showToast('Cannot delete root folder.', '⚠️'); return; }
    if (await showConfirm(`Delete folder "${current.name}" and its content?`, 'Delete Folder')) {
      const parent = folderMap[current.parentId]; if (parent) {
        parent.subfolders = parent.subfolders.filter(id => id !== current.id); delete folderMap[current.id]; activeFolderId = parent.id; saveState(); renderAll();
      }
    }
  });
  clearQBtn?.addEventListener('click', async () => {
    if (await showConfirm('Clear all questions from active folder?', 'Confirm Clear')) { getActiveFolder().questions = []; saveState(); renderQuestions(); }
  });

  // 23. PDF GENERATOR
  function generatePDF() {
    const questions = getActiveFolder().questions; if (questions.length === 0) return;
    if (!window.jspdf) { showToast('jsPDF library not loaded.', '❌'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const PAGE_W = 210, PAGE_H = 297, TOP = 15, BOTTOM = PAGE_H - 13, LEFT_DIV = 25, RIGHT_DIV = PAGE_W - 28;
    function dividers() { doc.setDrawColor(0); doc.setLineWidth(0.3); doc.line(LEFT_DIV, TOP, LEFT_DIV, BOTTOM); doc.line(RIGHT_DIV, TOP, RIGHT_DIV, BOTTOM); }
    let currentPg = 1;
    const includeIndexEl = document.getElementById('include-index');
    if (includeIndexEl && includeIndexEl.checked) {
      dividers();
      doc.setFont('helvetica', 'bold'); doc.setFontSize(16);
      doc.text('QUESTION-CUM-ANSWER BOOKLET INDEX', PAGE_W / 2, 25, { align: 'center' });
      doc.setFontSize(11); doc.setFont('helvetica', 'normal');
      doc.text(`Folder: ${getActiveFolder().name}`, PAGE_W / 2, 32, { align: 'center' });
      let y = 45;
      doc.setFont('helvetica', 'bold'); doc.text('Q#', 28, y); doc.text('Question', 40, y); doc.text('Marks', 170, y);
      y += 4; doc.line(28, y, 180, y); y += 6; doc.setFont('helvetica', 'normal');
      questions.forEach((q, idx) => {
        if (y > 270) { doc.addPage(); currentPg++; dividers(); y = 25; }
        doc.text(`${idx + 1}`, 28, y);
        const textLines = doc.splitTextToSize(q.question, 125);
        doc.text(textLines, 40, y); doc.text(`${q.marks}M`, 170, y);
        y += textLines.length * 5 + 4;
      });
      doc.addPage(); currentPg++;
    }
    questions.forEach((q, idx) => {
      const pageCount = MARK_RULES[q.marks] || 2;
      for (let p = 1; p <= pageCount; p++) {
        dividers();
        if (p === 1) {
          doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
          doc.text(`Q${idx + 1}.`, 28, 22);
          doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5);
          const lines = doc.splitTextToSize(q.question, 138); doc.text(lines, 38, 22);
          let boxY = 22 + lines.length * 5 + 2;
          doc.setFont('helvetica', 'italic'); doc.setFontSize(9);
          const metaText = q.year ? `[ ${q.marks} Marks / ${q.year} ]` : `[ ${q.marks} Marks ]`;
          doc.text(metaText, 38, boxY); doc.line(28, boxY + 3, RIGHT_DIV - 3, boxY + 3);
        }
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
        doc.text(`Page ${currentPg}`, PAGE_W / 2, PAGE_H - 8, { align: 'center' });
        if (!(idx === questions.length - 1 && p === pageCount)) { doc.addPage(); currentPg++; }
      }
    });
    doc.save(`${getActiveFolder().name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qcab.pdf`);
  }
  generateBtn?.addEventListener('click', generatePDF);

  // 24. RENDER ALL
  function renderAll() { renderBreadcrumbs(); renderFolders(); renderQuestions(); updateStudyDashboard(); }

  // 25. SEARCH & FILTER LISTENERS
  let searchTimeout;
  searchInput?.addEventListener('input', () => { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => renderBankResults(), 300); });
  searchBankBtn?.addEventListener('click', (e) => { e.preventDefault(); renderBankResults(); });
  filterPaper?.addEventListener('change', () => { populateFilterTopics(); renderBankResults(); });
  filterYear?.addEventListener('change', renderBankResults);
  filterTopic?.addEventListener('change', renderBankResults);
  clearResultsBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (searchInput) searchInput.value = '';
    if (filterPaper) filterPaper.value = 'ALL';
    if (filterYear) filterYear.value = 'ALL';
    if (filterTopic) filterTopic.value = 'ALL';
    populateFilterTopics(); renderBankResults();
  });
  clearBankBtn?.addEventListener('click', async () => {
    if (await showConfirm('Reset and reload default questions?', 'Confirm Reset')) {
      presetBank = []; localStorage.removeItem(PRESET_STORAGE_KEY); localStorage.removeItem(VERSION_KEY);
      updateBankStatus(); if (bankResultsContainer) bankResultsContainer.innerHTML = '<p style="font-size:13px; color:var(--muted); font-style:italic;">Reloading questions...</p>';
      await loadRepositoryJSON();
    }
  });

  // 26. AUTH BUTTON LISTENERS
  async function handleAuthToggle() {
    if (typeof getUser !== 'function' || typeof setUser !== 'function') {
      showToast('Authentication module not loaded.', '⚠️'); return;
    }
    const user = getUser();
    if (user) {
      if (await showConfirm('Logout?', 'Confirm Logout')) { setUser(null); showToast('Logged out.', '👋'); studyData = {}; renderBankResults(); updateStudyDashboard(); }
    } else { window.location.href = 'login.html'; }
  }
  document.getElementById('topbar-login-btn')?.addEventListener('click', handleAuthToggle);
  document.getElementById('sidebar-login-btn')?.addEventListener('click', handleAuthToggle);

  // 27. AI MODEL SELECTION MODAL
  const aiModal = document.getElementById('ai-model-modal');
  const aiModalClose = document.getElementById('ai-model-close');
  const cancelAiModal = document.getElementById('cancel-ai-modal');
  let pendingQuestion = null;
  function openAIModal(questionItem) { pendingQuestion = questionItem; if (aiModal) aiModal.classList.add('open'); }
  function closeAIModal() { if (aiModal) aiModal.classList.remove('open'); pendingQuestion = null; }
  aiModalClose?.addEventListener('click', closeAIModal);
  cancelAiModal?.addEventListener('click', closeAIModal);
  aiModal?.addEventListener('click', function(e) { if (e.target === this) closeAIModal(); });
  document.querySelectorAll('.model-option').forEach(btn => {
    btn.addEventListener('click', async function() {
      const model = this.dataset.model; if (!pendingQuestion) return;
      const question = pendingQuestion.question; const year = pendingQuestion.year || ''; const marks = pendingQuestion.marks || '';
      if (model === 'secret') {
        const params = new URLSearchParams({ q: question, y: year, m: marks, model: 'secret' });
        window.open(`answer.html?${params.toString()}`, '_blank'); closeAIModal(); return;
      }
      if (model === 'perplexity') {
        const query = generatePerplexityQuery(question);
        const searchUrl = `https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`;
        window.open(searchUrl, '_blank'); showToast('🌀 Opening Perplexity...', '🌀'); closeAIModal(); return;
      }
      const fullPrompt = generateFullPrompt(question);
      const siteUrl = model === 'chatgpt' ? 'https://chat.openai.com/' : 'https://chat.deepseek.com/';
      const modelName = model === 'chatgpt' ? 'ChatGPT' : 'DeepSeek';
      const icon = model === 'chatgpt' ? '💬' : '🔬';
      await copyText(fullPrompt);
      window.open(siteUrl, '_blank'); showToast(`✅ Prompt copied! Paste in ${modelName} and press Enter.`, icon);
      closeAIModal();
    });
  });

  // 28. FETCH AI ANSWER
  window.fetchAIAnswer = function(buttonElement) {
    const card = buttonElement.closest('.bank-item'); if (!card) return;
    const questionEl = card.querySelector('.bank-question');
    let questionText = questionEl ? questionEl.innerText.trim() : '';
    questionText = questionText.replace(/^\d+\.\s*/, '');
    const tags = card.querySelectorAll('.tag');
    let marks = '', year = '';
    tags.forEach(tag => { const text = tag.innerText; if (text.includes('M')) { const parts = text.split('/'); marks = parts[0].trim(); if (parts[1]) year = parts[1].trim(); } });
    const questionItem = { question: questionText, marks, year };
    openAIModal(questionItem);
  };

  // 29. INITIALIZATION
  renderAll();
  loadRepositoryJSON();
  loadCloudStudy();
  if (typeof initAuth === 'function') initAuth();
  console.log('✅ QCAB Generator loaded successfully!');
  console.log('📋 Subtopics count:', Object.keys(SYLLABUS).length);
  console.log('📚 Bank size:', presetBank.length);
});
