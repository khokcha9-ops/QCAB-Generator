(function () {
  /* ==========================================
     1. THEME TOGGLE
     ========================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeText) themeText.textContent = 'Light Mode';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeText) themeText.textContent = 'Dark Mode';
    }
  }

  const savedTheme =
    localStorage.getItem('qcab_theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      localStorage.setItem('qcab_theme', nextTheme);
      applyTheme(nextTheme);
    });
  }

  /* ==========================================
     2. SYLLABUS MAPPING & PAPER CODES
     ========================================== */
  const SYLLABUS = {
    GS1: [
      'Art & Culture',
      'Modern History',
      'Post Independence',
      'World History',
      'Physical Geography',
      'Economic & Human Geography',
      'Indian society'
    ],
    GS2: ['Polity', 'Governance', 'Social Justice', 'International Relations'],
    GS3: [
      'Economy',
      'Agriculture',
      'Internal Security',
      'Environment & Disaster Management',
      'Science & Tech'
    ],
    GS4: ['Ethics Theory', 'Case Studies'],
    OPT1: ['Anthropology Paper 1 Topics'],
    OPT2: ['Anthropology Paper 2 Topics']
  };

  function normalizePaperCode(paperVal) {
    if (!paperVal) return 'GS1';
    const str = String(paperVal).toUpperCase().replace(/[\s\-_]/g, '');
    if (str.includes('GS1') || str.includes('PAPER1')) return 'GS1';
    if (
      str.includes('GS2') ||
      str.includes('PAPER2') ||
      str.includes('POLITY') ||
      str.includes('GOVERNANCE')
    )
      return 'GS2';
    if (str.includes('GS3') || str.includes('PAPER3')) return 'GS3';
    if (str.includes('GS4') || str.includes('PAPER4')) return 'GS4';
    if (str.includes('OPT1') || str.includes('OPTIONAL1')) return 'OPT1';
    if (str.includes('OPT2') || str.includes('OPTIONAL2')) return 'OPT2';
    return 'GS1';
  }

  function getPaperTagClass(paper) {
    const norm = normalizePaperCode(paper);
    if (norm === 'GS1') return 'tag-paper-gs1';
    if (norm === 'GS2') return 'tag-paper-gs2';
    if (norm === 'GS3') return 'tag-paper-gs3';
    if (norm === 'GS4') return 'tag-paper-gs4';
    return 'tag-paper-opt';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[m];
    });
  }

  function generateUniqueId(prefix = 'id') {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `${prefix}_${crypto.randomUUID()}`;
    }
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /* ==========================================
     3. PRESET BANK & SEPARATE JSON LOADING
     ========================================== */
  const PRESET_STORAGE_KEY = 'qcab_preset_bank';
  let presetBank = JSON.parse(localStorage.getItem(PRESET_STORAGE_KEY)) || [];

  /* Fuse.js Initialization & Helper Functions */
  let fuseInstance = null;
  const fuseOptions = {
    includeScore: true,
    threshold: 0.4, // Optimal typo tolerance balance
    keys: ['question', 'topic', 'paper', 'year']
  };

  function initFuseIndex() {
    if (typeof Fuse !== 'undefined' && Array.isArray(presetBank)) {
      fuseInstance = new Fuse(presetBank, fuseOptions);
    }
  }

  function updateFuseIndex() {
    if (fuseInstance && Array.isArray(presetBank)) {
      fuseInstance.setCollection(presetBank);
    } else {
      initFuseIndex();
    }
  }

  function savePresets() {
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presetBank));
    updateBankStatus();
    updateFuseIndex();
  }

  function updateBankStatus() {
    const statusEl = document.getElementById('bank-status-text');
    if (statusEl) {
      statusEl.textContent = `Current Bank Size: ${presetBank.length} question(s) loaded.`;
    }
  }

  async function fetchJSONFile(url) {
    try {
      const response = await fetch(url);
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
      const [gs1Data, gs2Data, gs3Data] = await Promise.all([
        fetchJSONFile('./gs1_pyq.json'),
        fetchJSONFile('./gs2_pyq.json'),
        fetchJSONFile('./gs3_pyq.json')
      ]);

      const incomingQuestions = [...gs1Data, ...gs2Data, ...gs3Data];
      let formattedCount = 0;

      incomingQuestions.forEach((q) => {
        const cleanMarks =
          typeof q.marks === 'string'
            ? parseInt(q.marks.replace(/[^0-9]/g, ''), 10) || 10
            : parseInt(q.marks || 10, 10);

        const item = {
          id: q.id || generateUniqueId('q'),
          paper: normalizePaperCode(q.paper || q.subject || q.gs || 'GS1'),
          topic: q.subtopic || q.topic || q.category || 'General',
          year: String(q.year || q.exam_year || '2025').trim(),
          marks: cleanMarks,
          question: (q.question || q.text || q.q_text || q.title || '').trim()
        };

        const exists = presetBank.some(
          (existing) => existing.question.trim().toLowerCase() === item.question.toLowerCase()
        );

        if (item.question && !exists) {
          presetBank.push(item);
          formattedCount++;
        }
      });

      if (formattedCount > 0 || presetBank.length > 0) {
        savePresets();
      }

      populateFilterYears();
      populateFilterTopics();
      renderBankResults();
    } catch (err) {
      console.warn('Repository load error:', err);
      updateBankStatus();
    }
  }

  /* ==========================================
     4. FOLDER & BOOKLET STATE
     ========================================== */
  const MARK_RULES = { 10: 2, 15: 3, 20: 4 };
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
  let editingIndex = null;

  function saveState() {
    localStorage.setItem('qcab_nested_folders', JSON.stringify(folderMap));
    localStorage.setItem('qcab_active_nested_folder', activeFolderId);
  }
  function getActiveFolder() {
    return folderMap[activeFolderId] || folderMap['root'];
  }

  /* ==========================================
     5. DOM ELEMENT BINDINGS
     ========================================== */
  const breadcrumbs = document.getElementById('breadcrumbs');
  const folderBar = document.getElementById('folder-bar');
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
  const modeYearRadio = document.getElementById('mode-year');
  const modeTopicRadio = document.getElementById('mode-topic');
  const filterPaper = document.getElementById('filter-paper');
  const filterYear = document.getElementById('filter-year');
  const filterTopic = document.getElementById('filter-topic');
  const searchBankBtn = document.getElementById('search-bank-btn');
  const clearResultsBtn = document.getElementById('clear-results-btn');
  const bankResultsContainer = document.getElementById('bank-results-container');

  let selectedMarks = 10;
  if (marksButtons.length > 0) marksButtons[0].setAttribute('aria-pressed', 'true');

  marksButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedMarks = parseInt(btn.dataset.marks, 10);
      marksButtons.forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
    });
  });

  function populateFormSubtopics() {
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
  if (qPaper) qPaper.addEventListener('change', populateFormSubtopics);

  function populateFilterYears() {
    if (!filterYear) return;
    const prevSelected = filterYear.value;
    filterYear.innerHTML = '<option value="ALL">-- All Years --</option>';
    const yearsInBank = [
      ...new Set(presetBank.map((q) => String(q.year)).filter((y) => y && y !== 'undefined'))
    ];
    if (yearsInBank.length === 0) {
      yearsInBank.push('2025', '2024', '2023', '2022', '2021', '2020');
    } else {
      yearsInBank.sort((a, b) => b - a);
    }
    yearsInBank.forEach((yr) => {
      const opt = document.createElement('option');
      opt.value = yr;
      opt.textContent = yr;
      filterYear.appendChild(opt);
    });
    if (prevSelected && filterYear.querySelector(`option[value="${prevSelected}"]`)) {
      filterYear.value = prevSelected;
    }
  }

  function updateFilterMode() {
    if (!filterYear || !filterTopic) return;
    filterYear.style.display = 'inline-block';
    if (modeYearRadio && modeYearRadio.checked) {
      filterTopic.style.display = 'none';
    } else {
      filterTopic.style.display = 'inline-block';
      populateFilterTopics();
    }
  }

  function populateFilterTopics() {
    if (!filterTopic || !filterPaper) return;
    filterTopic.innerHTML = '<option value="ALL">-- All Subtopics --</option>';
    const paper = filterPaper.value;
    let list = [];
    if (paper === 'ALL') {
      Object.values(SYLLABUS).forEach((arr) => list.push(...arr));
      list = [...new Set(list)];
    } else {
      list = SYLLABUS[paper] || [];
    }
    list.forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      filterTopic.appendChild(opt);
    });
  }

  if (filterPaper)
    filterPaper.addEventListener('change', () => {
      populateFilterYears();
      populateFilterTopics();
      renderBankResults();
    });
  if (filterYear) filterYear.addEventListener('change', renderBankResults);
  if (filterTopic) filterTopic.addEventListener('change', renderBankResults);
  if (modeYearRadio) modeYearRadio.addEventListener('change', () => { updateFilterMode(); renderBankResults(); });
  if (modeTopicRadio) modeTopicRadio.addEventListener('change', () => { updateFilterMode(); renderBankResults(); });

  if (searchInput) searchInput.addEventListener('input', renderBankResults);
  if (searchBankBtn) searchBankBtn.addEventListener('click', renderBankResults);

  if (clearResultsBtn) {
    clearResultsBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (bankResultsContainer)
        bankResultsContainer.innerHTML =
          '<p style="font-size:13px; color:var(--ink-soft); font-style:italic;">Search results cleared.</p>';
    });
  }

  if (clearBankBtn) {
    clearBankBtn.addEventListener('click', async () => {
      if (confirm('Reset and reload default questions from files?')) {
        presetBank = [];
        localStorage.removeItem(PRESET_STORAGE_KEY);
        updateBankStatus();
        if (bankResultsContainer)
          bankResultsContainer.innerHTML =
            '<p style="font-size:13px; color:var(--ink-soft); font-style:italic;">Reloading questions...</p>';
        await loadRepositoryJSON();
      }
    });
  }

  /* ==========================================
     6. RENDER SEARCH RESULTS (FUZZY SEARCH & FILTERS)
     ========================================== */
  function renderBankResults() {
    if (!bankResultsContainer) return;
    bankResultsContainer.innerHTML = '';
    const selectedP = filterPaper ? filterPaper.value : 'ALL';
    const selectedY = filterYear ? filterYear.value : 'ALL';
    const selectedT = filterTopic ? filterTopic.value : 'ALL';
    const isYearMode = modeYearRadio ? modeYearRadio.checked : true;
    const query = searchInput ? searchInput.value.trim() : '';

    let candidateQuestions = [];

    // Ensure Fuse index is active
    if (!fuseInstance) initFuseIndex();

    // Perform Fuzzy Search if search input has text; otherwise take all questions
    if (query && fuseInstance) {
      const fuseResults = fuseInstance.search(query);
      candidateQuestions = fuseResults.map((res) => res.item);
    } else {
      candidateQuestions = presetBank;
    }

    // Apply Dropdown Filters
    let filtered = candidateQuestions.filter((q) => {
      const normQPaper = normalizePaperCode(q.paper);
      const normSelectedP = normalizePaperCode(selectedP);

      if (selectedP !== 'ALL' && normQPaper !== normSelectedP) return false;
      if (selectedY !== 'ALL' && String(q.year).trim() !== String(selectedY).trim()) return false;

      if (!isYearMode && selectedT !== 'ALL') {
        const qTopicClean = String(q.topic || '').trim().toLowerCase();
        const selectedTClean = String(selectedT).trim().toLowerCase();
        const matchesTopic =
          qTopicClean.includes(selectedTClean) || selectedTClean.includes(qTopicClean);
        if (!matchesTopic) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      bankResultsContainer.innerHTML =
        '<p style="font-size:13px; color:var(--ink-soft); font-style:italic;">No questions found matching this selection.</p>';
      return;
    }

    filtered.forEach((q) => {
      const div = document.createElement('div');
      div.className = 'bank-item';
      const paperClass = getPaperTagClass(q.paper);

      div.innerHTML = `
        <div style="font-size:13.5px; font-weight:600; margin-bottom:6px;">${escapeHtml(q.question)}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <span class="tag ${paperClass}">${escapeHtml(q.paper || 'GS1')}</span>
            <span class="tag tag-topic">${escapeHtml(q.topic || 'General')}</span>
            <span class="tag">${q.marks} M ${q.year ? '/ ' + escapeHtml(q.year) : ''}</span>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="btn-secondary-sm btn-add-item">+ Add to Booklet</button>
            <button class="btn-action-sm btn-direct-pdf">⚡ Direct to PDF</button>
          </div>
        </div>
      `;

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

  /* ==========================================
     7. FOLDER & BOOKLET MANAGEMENT UI
     ========================================== */
  if (renameFolderBtn) {
    renameFolderBtn.addEventListener('click', () => {
      const current = getActiveFolder();
      if (current.id === 'root') {
        alert('Cannot rename root folder.');
        return;
      }
      const newName = prompt('Rename folder:', current.name);
      if (newName && newName.trim()) {
        current.name = newName.trim();
        saveState();
        renderAll();
      }
    });
  }

  if (deleteFolderBtn) {
    deleteFolderBtn.addEventListener('click', () => {
      const current = getActiveFolder();
      if (current.id === 'root') {
        alert('Cannot delete root folder.');
        return;
      }
      if (confirm(`Delete folder "${current.name}" and its content?`)) {
        const parent = folderMap[current.parentId];
        if (parent) {
          parent.subfolders = parent.subfolders.filter((id) => id !== current.id);
          delete folderMap[current.id];
          activeFolderId = parent.id;
          saveState();
          renderAll();
        }
      }
    });
  }

  if (clearQBtn) {
    clearQBtn.addEventListener('click', () => {
      if (confirm('Clear all questions from active folder?')) {
        getActiveFolder().questions = [];
        saveState();
        renderQuestions();
      }
    });
  }

  function renderBreadcrumbs() {
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
    if (!folderBar) return;
    folderBar.innerHTML = '';
    const current = getActiveFolder();
    current.subfolders.forEach((subId) => {
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

  function resetForm() {
    editingIndex = null;
    if (qText) qText.value = '';
    if (qYear) qYear.value = '';
    const headingEl = document.getElementById('add-heading');
    if (headingEl) headingEl.textContent = 'Add Custom Question';
    if (addBtn) addBtn.textContent = 'Add to Active Folder';
    if (cancelEditBtn) cancelEditBtn.style.display = 'none';
  }
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', resetForm);

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const text = qText ? qText.value.trim() : '';
      if (!text) {
        if (qText) qText.focus();
        return;
      }

      const item = {
        question: text,
        marks: selectedMarks,
        year: qYear ? qYear.value.trim() : '',
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
  }

  if (addPresetBtn) {
    addPresetBtn.addEventListener('click', () => {
      const text = qText ? qText.value.trim() : '';
      if (!text) {
        if (qText) qText.focus();
        return;
      }
      const newPreset = {
        id: generateUniqueId('p'),
        paper: qPaper ? qPaper.value : 'GS1',
        topic: qTopic ? qTopic.value : 'General',
        year: qYear ? qYear.value.trim() || '2025' : '2025',
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
  }

  function renderQuestions() {
    if (!qList) return;
    const questions = getActiveFolder().questions;
    qList.innerHTML = '';
    if (questions.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (summaryBar) summaryBar.style.display = 'none';
      if (generateBtn) generateBtn.disabled = true;
      if (countTag) countTag.textContent = '0 questions';
      return;
    }
    if (emptyState) emptyState.style.display = 'none';
    if (summaryBar) summaryBar.style.display = 'flex';
    if (generateBtn) generateBtn.disabled = false;
    if (countTag) countTag.textContent = questions.length + ' question(s)';

    let totalMarks = 0,
      totalPages = 0;
    questions.forEach((q, i) => {
      totalMarks += q.marks;
      totalPages += MARK_RULES[q.marks] || 2;
      const li = document.createElement('li');
      li.className = 'q-item';
      const paperClass = getPaperTagClass(q.paper);

      li.innerHTML = `
        <div class="q-num">${i + 1}.</div>
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

    qList.querySelectorAll('.icon-btn').forEach((btn) => {
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
          marksButtons.forEach((b) =>
            b.setAttribute('aria-pressed', parseInt(b.dataset.marks, 10) === q.marks ? 'true' : 'false')
          );
          const headingEl = document.getElementById('add-heading');
          if (headingEl) headingEl.textContent = 'Edit Question #' + (i + 1);
          if (addBtn) addBtn.textContent = 'Update Question';
          if (cancelEditBtn) cancelEditBtn.style.display = 'block';
        } else if (btn.dataset.action === 'remove') {
          questions.splice(i, 1);
          saveState();
          renderQuestions();
        }
      });
    });
  }

  function renderAll() {
    renderBreadcrumbs();
    renderFolders();
    renderQuestions();
  }

  /* ==========================================
     8. PDF GENERATOR
     ========================================== */
  function generatePDF() {
    const questions = getActiveFolder().questions;
    if (questions.length === 0) return;
    if (!window.jspdf) {
      alert('jsPDF library not loaded.');
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const PAGE_W = 210,
      PAGE_H = 297,
      TOP = 15,
      BOTTOM = PAGE_H - 13,
      LEFT_DIV = 25,
      RIGHT_DIV = PAGE_W - 28;

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
      doc.text('QUESTION-CUM-ANSWER BOOKLET INDEX', PAGE_W / 2, 25, { align: 'center' });
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Folder: ${getActiveFolder().name}`, PAGE_W / 2, 32, { align: 'center' });

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
        doc.text(`${idx + 1}`, 28, y);
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
          doc.text(`Q${idx + 1}.`, 28, 22);
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
        doc.text(`Page ${currentPg}`, PAGE_W / 2, PAGE_H - 8, { align: 'center' });

        if (!(idx === questions.length - 1 && p === pageCount)) {
          doc.addPage();
          currentPg++;
        }
      }
    });

    doc.save(`${getActiveFolder().name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qcab.pdf`);
  }

  if (generateBtn) generateBtn.addEventListener('click', generatePDF);

  /* ==========================================
     9. INITIALIZATION ON PAGE LOAD
     ========================================== */
  initFuseIndex();
  populateFormSubtopics();
  populateFilterYears();
  populateFilterTopics();
  updateFilterMode();
  renderAll();
  loadRepositoryJSON();
})();
import { GoogleGenAI } from "https://esm.run/@google/genai";

// Initialize the SDK
const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6INjKAI38cA_eLdu2WpwNqltgiehRngdBqL-ZtCHybiFg" });

// Attach it to window so your HTML onclick attribute can find it
window.fetchAIAnswer = async function(buttonElement) {
    try {
        // Find the question text container relative to the button clicked
        const questionCard = buttonElement.closest('.rounded-xl, div'); // adjust selector based on your HTML
        // Add your generation logic here using `ai.models.generateContent(...)`
        
    } catch (error) {
        console.error("AI generation failed:", error);
    }
};
