// ============================================================
// js/app.js - Complete Application Logic
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

  // ============================================================
  // 1. NAVIGATION
  // ============================================================
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
      if(match) match.classList.add('active');
    });
  });

  // ============================================================
  // 2. THEME
  // ============================================================
  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : '');
    localStorage.setItem('qcab_theme', theme);
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');
    const mobileIcon = document.getElementById('mobile-theme-toggle');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    if (text) text.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    if (mobileIcon) mobileIcon.textContent = isDark ? '☀️' : '🌙';
  }

  const savedTheme = localStorage.getItem('qcab_theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  });
  document.getElementById('mobile-theme-toggle')?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  });
  document.getElementById('sidebar-theme')?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  });

  // ============================================================
  // 3. MOBILE MENU
  // ============================================================
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
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);
  })();

  // ============================================================
  // 4. BANK COLLAPSE
  // ============================================================
  const toggleBankBtn = document.getElementById('toggle-bank-btn');
  const toggleBankIcon = document.getElementById('toggle-bank-icon');
  const toggleBankText = document.getElementById('toggle-bank-text');
  const bankBody = document.getElementById('pyq-bank-body');

  // Force bank visible on load
  bankBody.style.display = 'block';
  if (toggleBankIcon) toggleBankIcon.textContent = '▾';
  if (toggleBankText) toggleBankText.textContent = 'Hide Bank';

  if (toggleBankBtn) {
    toggleBankBtn.addEventListener('click', () => {
      const isHidden = bankBody.style.display === 'none';
      bankBody.style.display = isHidden ? 'block' : 'none';
      if (toggleBankIcon) toggleBankIcon.textContent = isHidden ? '▾' : '▸';
      if (toggleBankText) toggleBankText.textContent = isHidden ? 'Hide Bank' : 'Show Bank';
    });
  }

  // ============================================================
  // 5. CREATE FORM COLLAPSE
  // ============================================================
  const toggleCreateBtn = document.getElementById('toggle-create-section-btn');
  const createFormBody = document.getElementById('create-form-body');
  if (toggleCreateBtn && createFormBody) {
    toggleCreateBtn.addEventListener('click', () => {
      const isHidden = createFormBody.style.display === 'none';
      createFormBody.style.display = isHidden ? 'block' : 'none';
      toggleCreateBtn.textContent = isHidden ? 'Hide Form ▾' : 'Show Form ▸';
    });
  }

  // ============================================================
  // 6. POPULATE FORM SUBTOPICS
  // ============================================================
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

  // ============================================================
  // 7. DASHBOARD SYNC
  // ============================================================
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
    if(qCount) qCount.textContent = count;
    if(pageCount) pageCount.textContent = pages;
    if(bankCountEl) bankCountEl.textContent = bankCount;
  }

  // ============================================================
  // 8. SCROLL TO TOP
  // ============================================================
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================================
  // 9. HELPER FUNCTIONS
  // ============================================================
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
    const classes = {
      'GS1': 'tag-paper-gs1',
      'GS2': 'tag-paper-gs2',
      'GS3': 'tag-paper-gs3',
      'GS4': 'tag-paper-gs4'
    };
    return classes[norm] || 'tag-paper-opt';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (m) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[m];
    });
  }

  function generateUniqueId(prefix = 'id') {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `${prefix}_${crypto.randomUUID()}`;
    }
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

  // ============================================================
  // 10. STORAGE & STATE
  // ============================================================
  const PRESET_STORAGE_KEY = 'qcab_preset_bank';
  const VERSION_KEY = 'qcab_data_version';
  const CURRENT_VERSION = '2';

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

  // ============================================================
  // 11. FOLDER & BOOKLET STATE
  // ============================================================
  const defaultRoot = {
    id: 'root',
    name: 'General Booklet',
    parentId: null,
    subfolders: [],
    questions: []
  };
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

  // ============================================================
  // 12. DOM REFERENCES
  // ============================================================
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

  // ============================================================
  // 13. STUDY DATA FUNCTIONS
  // ============================================================
  function getStudyRecord(q) {
    const id = q.id || q.question;
    if (!studyData[id]) studyData[id] = { bookmarked: false, revised: false, note: '' };
    return studyData[id];
  }

  function updateStudyDashboard() {
    let bookmarked = 0, revised = 0, withNotes = 0;
    const listContainer = document.getElementById('study-list-container');
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

    document.getElementById('study-bookmarked').textContent = bookmarked;
    document.getElementById('study-revised').textContent = revised;
    document.getElementById('study-notes').textContent = withNotes;

    if (items.length === 0) {
      listContainer.innerHTML = '<p style="color:var(--muted);font-style:italic;">You haven\'t bookmarked any questions yet. Use the ⭐ button on any question to start.</p>';
      return;
    }

    let html = '<div style="display:grid;gap:10px;">';
    items.forEach(q => {
      const rec = getStudyRecord(q);
      const status = rec.revised ? '✅ Revised' : '⏳ Not revised';
      const notePreview = rec.note ? rec.note.substring(0, 60) + (rec.note.length>60?'…':'') : 'No note';
      html += `
        <div style="border:1px solid var(--border);border-radius:10px;padding:12px;background:var(--surface-2);">
          <div style="font-weight:700;margin-bottom:4px;">${escapeHtml(q.question)}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;font-size:12px;">
            <span class="tag">${escapeHtml(q.paper)}</span>
            <span class="tag tag-topic">${escapeHtml(q.topic)}</span>
            <span class="tag">${q.year||''}</span>
            <span class="tag">${status}</span>
            <span class="tag">📝 ${notePreview}</span>
          </div>
        </div>
      `;
    });
    html += '</div>';
    listContainer.innerHTML = html;
  }

  // ============================================================
  // 14. POPULATE FILTERS
  // ============================================================
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
      opt.value = t;
      opt.textContent = t;
      filterTopic.appendChild(opt);
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
        opt.value = yr;
        opt.textContent = yr;
        filterYear.appendChild(opt);
      }
    }

    const hasOther = presetBank.some(q => getYearGroup(q) === 'Other');
    if (hasOther) {
      const opt = document.createElement('option');
      opt.value = 'Other';
      opt.textContent = 'Other (Before 2013 / Outside 2013–2026)';
      filterYear.appendChild(opt);
    }

    if (prevSelected && filterYear.querySelector(`option[value="${prevSelected}"]`)) {
      filterYear.value = prevSelected;
    }
  }

  // ============================================================
  // 15. LOAD QUESTIONS FROM JSON
  // ============================================================
  async function fetchJSONFile(url) {
    try {
      const response = await fetch(url + '?t=' + Date.now());
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : data.questions || data.bank || data.data || [];
    } catch (err) {
      console.warn(`Could not load file from ${url}:`, err);
      return [];
    }
  }

  async function loadRepositoryJSON() {
    try {
      const [gs1Data, gs2Data, gs3Data, gs4Data, opt1Data, opt2Data] = await Promise.all([
        fetchJSONFile('./gs1_pyq.json'),
        fetchJSONFile('./gs2_pyq.json'),
        fetchJSONFile('./gs3_pyq.json'),
        fetchJSONFile('./gs4_pyq.json'),
        fetchJSONFile('./opt1_pyq.json'),
        fetchJSONFile('./opt2_pyq.json')
      ]);

      const incoming = [...gs1Data, ...gs2Data, ...gs3Data, ...gs4Data, ...opt1Data, ...opt2Data];
      const newQuestions = [];

      incoming.forEach((q) => {
        const questionText = (q.question || q.q_text || q.text || q.title || '').trim();
        if (!questionText || questionText.toLowerCase() === 'year' || questionText.toLowerCase() === 'syllabus') return;

        let rawMarks = q.marks || q.mark || 10;
        if (typeof rawMarks === 'string') {
          rawMarks = parseInt(rawMarks.replace(/[^0-9]/g, ''), 10) || 10;
        }

        const rawYearText = String(q.year || q.exam_year || q.Year || '').trim();
        const yearMatch = rawYearText.match(/\b(19\d{2}|20\d{2})\b/);
        const rawYear = yearMatch ? yearMatch[1] : 'Other';
        const yearNumber = rawYear === 'Other' ? NaN : Number(rawYear);
        const yearGroup = Number.isInteger(yearNumber) && yearNumber >= 2013 && yearNumber <= 2026
          ? String(yearNumber)
          : 'Other';

        const rawPaper = q.paper || q.gs || q.subject || 'GS1';
        const rawTopic = q.topic || q.subtopic || q.category || SYLLABUS[normalizePaperCode(rawPaper)]?.[0] || 'General';

        const item = {
          id: q.id || generateUniqueId('q'),
          paper: normalizePaperCode(rawPaper),
          topic: String(rawTopic).trim(),
          year: rawYearText || rawYear,
          yearGroup: yearGroup,
          marks: Number(rawMarks),
          question: questionText
        };
        newQuestions.push(item);
      });

      const existingCustom = presetBank.filter(ex => {
        return !newQuestions.some(nq => nq.question.trim().toLowerCase() === ex.question.trim().toLowerCase());
      });

      presetBank = [...newQuestions, ...existingCustom];
      savePresets();

      populateFilterYears();
      populateFilterTopics();
      renderBankResults();
      updateBankStatus();
      updateStudyDashboard();

    } catch (err) {
      console.warn('Repository load error:', err);
      updateBankStatus();
    }
  }

  function savePresets() {
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presetBank));
    updateBankStatus();
  }

  function updateBankStatus() {
    if (bankStatusText) {
      bankStatusText.textContent = `Current Bank Size: ${presetBank.length} question(s) loaded.`;
    }
    syncDashboard();
  }

  // ============================================================
  // 16. RENDER BANK RESULTS (with combined filters)
  // ============================================================
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

    let filtered = presetBank.filter((q) => {
      const qText = `${q.question || ''} ${q.topic || ''} ${q.paper || ''} ${q.year || ''}`.toLowerCase();

      // Search query
      if (query && !qText.includes(query)) return false;

      // Paper filter
      if (selectedP !== 'ALL' && q.paper !== selectedP) return false;

      // Year filter
      if (selectedY !== 'ALL' && getYearGroup(q) !== String(selectedY).trim()) return false;

      // Topic filter
      if (selectedT !== 'ALL') {
        const qTopicClean = String(q.topic || '').trim().toLowerCase();
        const selectedTClean = String(selectedT).trim().toLowerCase();
        const matchesTopic = qTopicClean.includes(selectedTClean) || selectedTClean.includes(qTopicClean);
        if (!matchesTopic) return false;
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
            <button class="btn-secondary-sm btn-ai-answer btn-ai-highlight" onclick="fetchAIAnswer(this)">✨ AI</button>
          </div>
        </div>
      `;

      div.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const action = btn.dataset.action;
          const id = btn.dataset.id;
          if (action === 'bookmark') {
            studyData[id] = studyData[id] || { bookmarked: false, revised: false, note: '' };
            studyData[id].bookmarked = !studyData[id].bookmarked;
            saveStudyData();
            renderBankResults();
          } else if (action === 'revise') {
            studyData[id] = studyData[id] || { bookmarked: false, revised: false, note: '' };
            studyData[id].revised = !studyData[id].revised;
            saveStudyData();
            renderBankResults();
          } else if (action === 'note') {
            openNoteModal(id);
          }
        });
      });

      div.querySelector('.btn-add-item').addEventListener('click', () => {
        getActiveFolder().questions.push({
          question: q.question,
          marks: q.marks,
          year: q.year,
          paper: q.paper,
          topic: q.topic
        });
        saveState();
        renderQuestions();
      });

      div.querySelector('.btn-direct-pdf').addEventListener('click', () => {
        getActiveFolder().questions.push({
          question: q.question,
          marks: q.marks,
          year: q.year,
          paper: q.paper,
          topic: q.topic
        });
        saveState();
        renderQuestions();
        generatePDF();
      });

      bankResultsContainer.appendChild(div);
    });
  }

  // ============================================================
  // 17. NOTE MODAL
  // ============================================================
  let currentNoteId = null;

  function openNoteModal(id) {
    currentNoteId = id;
    const rec = studyData[id] || { note: '' };
    document.getElementById('note-textarea').value = rec.note || '';
    document.getElementById('note-modal').classList.add('open');
  }

  function closeNoteModal() {
    document.getElementById('note-modal').classList.remove('open');
    currentNoteId = null;
  }

  document.getElementById('note-cancel-btn')?.addEventListener('click', closeNoteModal);
  document.getElementById('note-save-btn')?.addEventListener('click', () => {
    if (currentNoteId) {
      const note = document.getElementById('note-textarea').value.trim();
      studyData[currentNoteId] = studyData[currentNoteId] || { bookmarked: false, revised: false, note: '' };
      studyData[currentNoteId].note = note;
      saveStudyData();
      closeNoteModal();
      renderBankResults();
    }
  });
  document.getElementById('note-modal')?.addEventListener('click', function(e) {
    if (e.target === this) closeNoteModal();
  });

  // ============================================================
  // 18. STUDY SAVE/LOAD (Cloudflare)
  // ============================================================
  async function saveStudyData() {
    const USER_TOKEN = localStorage.getItem('userToken') || localStorage.getItem('qcab_owner_key');
    if (!USER_TOKEN) return;

    const keys = Object.keys(studyData);
    for (const question_id of keys) {
      const rec = studyData[question_id];
      if (!rec || typeof rec !== 'object') continue;
      try {
        await fetch(`${WORKER_URL}/api/study/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + USER_TOKEN
          },
          body: JSON.stringify({
            question_id: question_id,
            bookmarked: rec.bookmarked ? 1 : 0,
            revised: rec.revised ? 1 : 0,
            note: rec.note || ''
          })
        });
      } catch (e) {
        console.error('Failed to save to cloud for', question_id, e);
      }
    }
    updateStudyDashboard();
  }

  async function loadCloudStudy() {
    const USER_TOKEN = localStorage.getItem('userToken') || localStorage.getItem('qcab_owner_key');
    if (!USER_TOKEN) return;
    try {
      const res = await fetch(`${WORKER_URL}/api/study/get`, {
        headers: { 'Authorization': 'Bearer ' + USER_TOKEN }
      });
      if (!res.ok) return;
      const data = await res.json();
      data.forEach(item => {
        studyData[item.question_id] = {
          bookmarked: item.bookmarked == 1,
          revised: item.revised == 1,
          note: item.note || ''
        };
      });
      updateStudyDashboard();
      renderBankResults();
    } catch (e) {
      console.error('Failed to load study data from cloud', e);
    }
  }

  // ============================================================
  // 19. EXPORT/IMPORT STUDY DATA
  // ============================================================
  document.getElementById('export-study-btn')?.addEventListener('click', () => {
    const data = JSON.stringify(studyData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qcab_study_data.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('import-study-btn')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(ev) {
        try {
          const data = JSON.parse(ev.target.result);
          if (typeof data === 'object') {
            studyData = data;
            saveStudyData();
            renderBankResults();
            alert('Study data imported successfully!');
          } else {
            alert('Invalid file format.');
          }
        } catch(err) { alert('Error reading file.'); }
      };
      reader.readAsText(file);
    };
    input.click();
  });

  // ============================================================
  // 20. RENDER QUESTIONS (QCAB)
  // ============================================================
  function renderQuestions() {
    if (!qList) return;
    const questions = getActiveFolder().questions;
    qList.innerHTML = '';
    if (questions.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (summaryBar) summaryBar.style.display = 'none';
      if (generateBtn) generateBtn.disabled = true;
      if (countTag) countTag.textContent = '0 questions';
      syncDashboard();
      return;
    }
    if (emptyState) emptyState.style.display = 'none';
    if (summaryBar) summaryBar.style.display = 'grid';
    if (generateBtn) generateBtn.disabled = false;
    if (countTag) countTag.textContent = questions.length + ' question(s)';

    let totalMarks = 0, totalPages = 0;
    const MARK_RULES = { 10: 2, 15: 3, 20: 4 };

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
          const q = questions[i];
          editingIndex = i;
          if (qText) qText.value = q.question;
          if (qYear) qYear.value = q.year || '';
          if (qPaper) qPaper.value = q.paper || 'GS1';
          populateFormSubtopics();
          if (qTopic) qTopic.value = q.topic || '';
          selectedMarks = q.marks;
          marksButtons.forEach(b => b.setAttribute('aria-pressed', parseInt(b.dataset.marks,10) === q.marks ? 'true' : 'false'));
          const headingEl = document.getElementById('add-heading');
          if (headingEl) headingEl.textContent = 'Edit Question #' + (i+1);
          if (addBtn) addBtn.textContent = 'Update Question';
          if (cancelEditBtn) cancelEditBtn.style.display = 'block';
        } else if (btn.dataset.action === 'remove') {
          questions.splice(i, 1);
          saveState();
          renderQuestions();
        }
      });
    });

    syncDashboard();
  }

  // ============================================================
  // 21. ADD/EDIT QUESTION
  // ============================================================
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

    const item = {
      question: text,
      marks: selectedMarks,
      year: qYear ? qYear.value.trim() : '',
      yearGroup: getYearGroup({ year: qYear ? qYear.value.trim() : '' }),
      paper: qPaper ? qPaper.value : 'GS1',
      topic: qTopic ? qTopic.value : 'General'
    };
    const currentFolder = getActiveFolder();
    if (editingIndex !== null) currentFolder.questions[editingIndex] = item;
    else currentFolder.questions.push(item);
    resetForm();
    saveState();
    renderQuestions();
  });

  addPresetBtn?.addEventListener('click', () => {
    const text = qText ? qText.value.trim() : '';
    if (!text) { if (qText) qText.focus(); return; }
    const newPreset = {
      id: generateUniqueId('p'),
      paper: qPaper ? qPaper.value : 'GS1',
      topic: qTopic ? qTopic.value : 'General',
      year: qYear ? qYear.value.trim() || '2025' : '2025',
      yearGroup: getYearGroup({ year: qYear ? qYear.value.trim() || '2025' : '2025' }),
      marks: selectedMarks,
      question: text
    };
    presetBank.push(newPreset);
    savePresets();
    populateFilterYears();
    populateFilterTopics();
    alert('Question saved to Preset Bank!');
    resetForm();
    renderBankResults();
  });

  // ============================================================
  // 22. FOLDER MANAGEMENT
  // ============================================================
  function renderBreadcrumbs() {
    const breadcrumbs = document.getElementById('breadcrumbs');
    if (!breadcrumbs) return;
    breadcrumbs.innerHTML = '';
    const path = [];
    let curr = getActiveFolder();
    while (curr) {
      path.unshift(curr);
      curr = curr.parentId ? folderMap[curr.parentId] : null;
    }
    path.forEach((f, idx) => {
      if (idx > 0) breadcrumbs.appendChild(document.createTextNode(' / '));
      const crumb = document.createElement('span');
      crumb.className = 'crumb';
      crumb.textContent = f.name;
      crumb.addEventListener('click', () => {
        activeFolderId = f.id;
        saveState();
        renderAll();
      });
      breadcrumbs.appendChild(crumb);
    });
  }

  function renderFolders() {
    const folderBar = document.getElementById('folder-bar');
    if (!folderBar) return;
    folderBar.innerHTML = '';
    const current = getActiveFolder();
    current.subfolders.forEach(subId => {
      const sub = folderMap[subId];
      if (!sub) return;
      const tab = document.createElement('button');
      tab.className = 'folder-tab';
      tab.innerHTML = `📁 ${escapeHtml(sub.name)}`;
      tab.addEventListener('click', () => {
        activeFolderId = sub.id;
        saveState();
        renderAll();
      });
      folderBar.appendChild(tab);
    });
    const newBtn = document.createElement('button');
    newBtn.className = 'btn-new-folder';
    newBtn.textContent = '+ New Folder';
    newBtn.addEventListener('click', () => {
      const name = prompt(`Create subfolder under "${current.name}":`);
      if (name && name.trim()) {
        const newId = generateUniqueId('folder');
        folderMap[newId] = {
          id: newId,
          name: name.trim(),
          parentId: current.id,
          subfolders: [],
          questions: []
        };
        current.subfolders.push(newId);
        activeFolderId = newId;
        saveState();
        renderAll();
      }
    });
    folderBar.appendChild(newBtn);
  }

  renameFolderBtn?.addEventListener('click', () => {
    const current = getActiveFolder();
    if (current.id === 'root') { alert('Cannot rename root folder.'); return; }
    const newName = prompt('Rename folder:', current.name);
    if (newName && newName.trim()) {
      current.name = newName.trim();
      saveState();
      renderAll();
    }
  });

  deleteFolderBtn?.addEventListener('click', () => {
    const current = getActiveFolder();
    if (current.id === 'root') { alert('Cannot delete root folder.'); return; }
    if (confirm(`Delete folder "${current.name}" and its content?`)) {
      const parent = folderMap[current.parentId];
      if (parent) {
        parent.subfolders = parent.subfolders.filter(id => id !== current.id);
        delete folderMap[current.id];
        activeFolderId = parent.id;
        saveState();
        renderAll();
      }
    }
  });

  clearQBtn?.addEventListener('click', () => {
    if (confirm('Clear all questions from active folder?')) {
      getActiveFolder().questions = [];
      saveState();
      renderQuestions();
    }
  });

  // ============================================================
  // 23. PDF GENERATOR
  // ============================================================
  function generatePDF() {
    const questions = getActiveFolder().questions;
    if (questions.length === 0) return;
    if (!window.jspdf) { alert('jsPDF library not loaded.'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const PAGE_W = 210, PAGE_H = 297, TOP = 15, BOTTOM = PAGE_H - 13, LEFT_DIV = 25, RIGHT_DIV = PAGE_W - 28;
    const MARK_RULES = { 10: 2, 15: 3, 20: 4 };

    function dividers() {
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.line(LEFT_DIV, TOP, LEFT_DIV, BOTTOM);
      doc.line(RIGHT_DIV, TOP, RIGHT_DIV, BOTTOM);
    }

    let currentPg = 1;
    const includeIndexEl = document.getElementById('include-index');

    if (includeIndexEl && includeIndexEl.checked) {
      dividers();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('QUESTION-CUM-ANSWER BOOKLET INDEX', PAGE_W/2, 25, { align: 'center' });
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Folder: ${getActiveFolder().name}`, PAGE_W/2, 32, { align: 'center' });

      let y = 45;
      doc.setFont('helvetica', 'bold');
      doc.text('Q#', 28, y);
      doc.text('Question', 40, y);
      doc.text('Marks', 170, y);
      y += 4;
      doc.line(28, y, 180, y);
      y += 6;
      doc.setFont('helvetica', 'normal');

      questions.forEach((q, idx) => {
        if (y > 270) {
          doc.addPage();
          currentPg++;
          dividers();
          y = 25;
        }
        doc.text(`${idx+1}`, 28, y);
        const textLines = doc.splitTextToSize(q.question, 125);
        doc.text(textLines, 40, y);
        doc.text(`${q.marks}M`, 170, y);
        y += textLines.length * 5 + 4;
      });
      doc.addPage();
      currentPg++;
    }

    questions.forEach((q, idx) => {
      const pageCount = MARK_RULES[q.marks] || 2;
      for (let p = 1; p <= pageCount; p++) {
        dividers();
        if (p === 1) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text(`Q${idx+1}.`, 28, 22);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10.5);
          const lines = doc.splitTextToSize(q.question, 138);
          doc.text(lines, 38, 22);

          let boxY = 22 + lines.length * 5 + 2;
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(9);
          const metaText = q.year ? `[ ${q.marks} Marks / ${q.year} ]` : `[ ${q.marks} Marks ]`;
          doc.text(metaText, 38, boxY);
          doc.line(28, boxY + 3, RIGHT_DIV - 3, boxY + 3);
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(`Page ${currentPg}`, PAGE_W/2, PAGE_H - 8, { align: 'center' });

        if (!(idx === questions.length - 1 && p === pageCount)) {
          doc.addPage();
          currentPg++;
        }
      }
    });

    doc.save(`${getActiveFolder().name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qcab.pdf`);
  }

  generateBtn?.addEventListener('click', generatePDF);

  // ============================================================
  // 24. RENDER ALL
  // ============================================================
  function renderAll() {
    renderBreadcrumbs();
    renderFolders();
    renderQuestions();
    updateStudyDashboard();
  }

  // ============================================================
  // 25. SEARCH & FILTER EVENT LISTENERS
  // ============================================================
  searchInput?.addEventListener('input', renderBankResults);
  searchBankBtn?.addEventListener('click', renderBankResults);

  filterPaper?.addEventListener('change', () => {
    populateFilterTopics();
    renderBankResults();
  });

  filterYear?.addEventListener('change', renderBankResults);
  filterTopic?.addEventListener('change', renderBankResults);

  clearResultsBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (filterPaper) filterPaper.value = 'ALL';
    if (filterYear) filterYear.value = 'ALL';
    if (filterTopic) filterTopic.value = 'ALL';
    populateFilterTopics();
    renderBankResults();
  });

  clearBankBtn?.addEventListener('click', async () => {
    if (confirm('Reset and reload default questions?')) {
      presetBank = [];
      localStorage.removeItem(PRESET_STORAGE_KEY);
      localStorage.removeItem(VERSION_KEY);
      updateBankStatus();
      if (bankResultsContainer)
        bankResultsContainer.innerHTML = '<p style="font-size:13px; color:var(--muted); font-style:italic;">Reloading questions...</p>';
      await loadRepositoryJSON();
    }
  });

  // ============================================================
  // 26. LOGIN BUTTONS
  // ============================================================
  document.getElementById('topbar-login-btn')?.addEventListener('click', () => {
    const user = getUser();
    if (user) {
      if (confirm('Logout?')) {
        setUser(null);
        alert('Logged out.');
        // Clear study data
        studyData = {};
        renderBankResults();
        updateStudyDashboard();
      }
    } else {
      openLoginModal('login');
    }
  });

  document.getElementById('sidebar-login-btn')?.addEventListener('click', () => {
    const user = getUser();
    if (user) {
      if (confirm('Logout?')) {
        setUser(null);
        alert('Logged out.');
        studyData = {};
        renderBankResults();
        updateStudyDashboard();
      }
    } else {
      openLoginModal('login');
    }
  });

  // ============================================================
  // 27. INITIALIZATION
  // ============================================================
  renderAll();
  loadRepositoryJSON();
  loadCloudStudy();

  // Initialize auth (login modal)
  if (typeof initAuth === 'function') {
    initAuth();
  }

  console.log('✅ QCAB Generator loaded successfully!');
  console.log('📋 Subtopics count:', Object.keys(SYLLABUS).length);

}); // End DOMContentLoaded
