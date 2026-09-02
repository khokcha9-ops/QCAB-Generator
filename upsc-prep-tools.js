
/*
  QCAB UPSC PREPARATION TOOLS
  Drop-in module for the existing QCAB-Generator.
  Features:
  - Preparation dashboard
  - PYQ attempt/status tracking
  - Notes per PYQ
  - Timed answer-writing practice
  - Self-review checklist
  - Related PYQs using Fuse.js when available
  - Progress export/import
  - No AI evaluation
*/

(function () {
  "use strict";

  const BANK_KEY = "qcab_preset_bank";
  const PROGRESS_KEY = "qcab_upsc_progress_v1";
  const NOTES_KEY = "qcab_upsc_notes_v1";

  const state = loadJSON(PROGRESS_KEY, {});
  const notes = loadJSON(NOTES_KEY, {});
  let bank = [];
  let currentPractice = null;
  let practiceTimer = null;
  let practiceSeconds = 0;

  function loadJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  function saveState() {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  }

  function saveNotes() {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }

  function getBank() {
    const data = loadJSON(BANK_KEY, []);
    return Array.isArray(data) ? data : [];
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, m => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[m]));
  }

  function normalize(q) {
    return {
      id: q.id || ("generated_" + Math.random().toString(36).slice(2)),
      paper: q.paper || "GS1",
      topic: q.topic || "General",
      year: String(q.year || ""),
      marks: Number(q.marks) || 10,
      question: q.question || ""
    };
  }

  function getRecord(id) {
    if (!state[id]) {
      state[id] = {
        status: "not_attempted",
        attempts: 0,
        lastAttempted: null,
        lastRevised: null,
        review: {
          intro: 0, structure: 0, content: 0,
          examples: 0, analysis: 0, conclusion: 0
        }
      };
    }
    return state[id];
  }

  function mark(id, status) {
    const r = getRecord(id);
    r.status = status;
    if (status === "attempted" || status === "needs_revision") {
      r.attempts += 1;
      r.lastAttempted = new Date().toISOString();
    }
    if (status === "revised" || status === "mastered") {
      r.lastRevised = new Date().toISOString();
    }
    saveState();
  }

  function statusLabel(s) {
    return {
      not_attempted: "Not attempted",
      attempted: "Attempted",
      needs_revision: "Needs revision",
      revised: "Revised",
      mastered: "Mastered"
    }[s] || "Not attempted";
  }

  function injectUI() {
    if (document.getElementById("qcab-tools-root")) return;

    const root = document.createElement("div");
    root.id = "qcab-tools-root";
    root.innerHTML = `
      <div id="qcab-tools-modal" class="qpt-modal" aria-hidden="true">
        <div class="qpt-backdrop" data-close="1"></div>
        <div class="qpt-dialog">
          <div class="qpt-dialog-head">
            <div>
              <div class="qpt-kicker">UPSC PREPARATION TOOLS</div>
              <h2 id="qpt-dialog-title">Dashboard</h2>
            </div>
            <button class="qpt-close" data-close="1">×</button>
          </div>
          <div id="qpt-dialog-body"></div>
        </div>
      </div>
      <button id="qpt-floating" class="qpt-float" title="UPSC Preparation Tools">🎯</button>
    `;
    document.body.appendChild(root);

    const sidebar = document.querySelector(".sidebar .nav");
    if (sidebar) {
      const group = document.createElement("div");
      group.className = "qpt-nav-group";
      group.innerHTML = `
        <div class="qpt-nav-title">Preparation</div>
        <button class="nav-btn qpt-nav-btn" data-qpt="dashboard"><span class="nav-icon">📊</span>Dashboard</button>
        <button class="nav-btn qpt-nav-btn" data-qpt="practice"><span class="nav-icon">⏱️</span>Practice</button>
        <button class="nav-btn qpt-nav-btn" data-qpt="revision"><span class="nav-icon">🔁</span>Revision</button>
      `;
      sidebar.appendChild(group);
    }

    document.querySelectorAll("[data-qpt]").forEach(btn => {
      btn.addEventListener("click", () => openTool(btn.dataset.qpt));
    });
    document.getElementById("qpt-floating").addEventListener("click", () => openTool("dashboard"));

    document.querySelectorAll("[data-close]").forEach(el => {
      el.addEventListener("click", closeModal);
    });
  }

  function openModal(title, html) {
    const modal = document.getElementById("qcab-tools-modal");
    document.getElementById("qpt-dialog-title").textContent = title;
    document.getElementById("qpt-dialog-body").innerHTML = html;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    bindToolEvents();
  }

  function closeModal() {
    stopTimer();
    const modal = document.getElementById("qcab-tools-modal");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  function stats() {
    bank = getBank().map(normalize);
    const total = bank.length;
    const counts = {
      not_attempted: 0,
      attempted: 0,
      needs_revision: 0,
      revised: 0,
      mastered: 0
    };
    bank.forEach(q => counts[getRecord(q.id).status]++);
    return { total, counts };
  }

  function dashboard() {
    const s = stats();
    const attempted = s.total - s.counts.not_attempted;
    const pct = s.total ? Math.round((attempted / s.total) * 100) : 0;

    const paperStats = {};
    bank.forEach(q => {
      const p = q.paper || "Other";
      if (!paperStats[p]) paperStats[p] = { total: 0, attempted: 0 };
      paperStats[p].total++;
      if (getRecord(q.id).status !== "not_attempted") paperStats[p].attempted++;
    });

    const rows = Object.entries(paperStats).map(([p,v]) => `
      <div class="qpt-progress-row">
        <div><b>${esc(p)}</b><span>${v.attempted}/${v.total}</span></div>
        <div class="qpt-bar"><i style="width:${v.total ? Math.round(v.attempted/v.total*100) : 0}%"></i></div>
      </div>
    `).join("");

    openModal("UPSC Preparation Dashboard", `
      <div class="qpt-grid">
        <div class="qpt-stat"><span>Total PYQs</span><strong>${s.total}</strong></div>
        <div class="qpt-stat"><span>Attempted</span><strong>${attempted}</strong></div>
        <div class="qpt-stat"><span>Needs Revision</span><strong>${s.counts.needs_revision}</strong></div>
        <div class="qpt-stat"><span>Mastered</span><strong>${s.counts.mastered}</strong></div>
      </div>

      <div class="qpt-card">
        <div class="qpt-card-head">
          <div><b>Overall coverage</b><span>${pct}%</span></div>
          <div class="qpt-bar large"><i style="width:${pct}%"></i></div>
        </div>
      </div>

      <div class="qpt-card">
        <h3>Paper-wise progress</h3>
        ${rows || `<div class="qpt-empty">Load your PYQ bank first.</div>`}
      </div>

      <div class="qpt-actions">
        <button class="qpt-btn primary" data-action="practice">⏱ Start Practice</button>
        <button class="qpt-btn" data-action="revision">🔁 Revision Queue</button>
        <button class="qpt-btn" data-action="export">⬇ Export Progress</button>
        <button class="qpt-btn" data-action="import">⬆ Import Progress</button>
      </div>
    `);
  }

  function practice() {
    bank = getBank().map(normalize);
    if (!bank.length) {
      openModal("Practice", `<div class="qpt-empty">No PYQs are loaded yet.</div>`);
      return;
    }

    const papers = [...new Set(bank.map(q => q.paper))].sort();
    const topics = [...new Set(bank.map(q => q.topic))].sort();

    openModal("Timed Answer Practice", `
      <div class="qpt-card">
        <div class="qpt-form-grid">
          <label>Paper
            <select id="qpt-paper"><option value="ALL">All papers</option>${papers.map(p=>`<option>${esc(p)}</option>`).join("")}</select>
          </label>
          <label>Topic
            <select id="qpt-topic"><option value="ALL">All topics</option>${topics.map(t=>`<option>${esc(t)}</option>`).join("")}</select>
          </label>
          <label>Marks
            <select id="qpt-marks">
              <option value="ALL">Any marks</option>
              <option value="10">10 marks</option>
              <option value="15">15 marks</option>
              <option value="20">20 marks</option>
            </select>
          </label>
          <label>Time
            <select id="qpt-time">
              <option value="7">7 minutes</option>
              <option value="10">10 minutes</option>
              <option value="12">12 minutes</option>
              <option value="15">15 minutes</option>
            </select>
          </label>
        </div>
        <button class="qpt-btn primary wide" data-action="start-practice">🎯 Give me a PYQ</button>
      </div>
      <div id="qpt-practice-area"></div>
    `);
  }

  function startPractice() {
    const p = document.getElementById("qpt-paper").value;
    const t = document.getElementById("qpt-topic").value;
    const m = document.getElementById("qpt-marks").value;
    const mins = Number(document.getElementById("qpt-time").value);

    let candidates = bank.filter(q =>
      (p === "ALL" || q.paper === p) &&
      (t === "ALL" || q.topic === t) &&
      (m === "ALL" || String(q.marks) === m)
    );

    const unattempted = candidates.filter(q => getRecord(q.id).status === "not_attempted");
    if (unattempted.length) candidates = unattempted;
    if (!candidates.length) {
      alert("No question matches these settings.");
      return;
    }

    const q = candidates[Math.floor(Math.random() * candidates.length)];
    currentPractice = q;
    practiceSeconds = mins * 60;

    document.getElementById("qpt-practice-area").innerHTML = `
      <div class="qpt-card qpt-practice-card">
        <div class="qpt-practice-meta">
          <span>${esc(q.paper)}</span><span>${esc(q.topic)}</span><span>${q.marks} marks</span><span>${esc(q.year)}</span>
          <strong id="qpt-timer">${formatTime(practiceSeconds)}</strong>
        </div>
        <h3 class="qpt-question">${esc(q.question)}</h3>
        <textarea id="qpt-answer" class="qpt-answer" placeholder="Write your answer here..."></textarea>
        <div class="qpt-word-count">Words: <strong id="qpt-words">0</strong></div>
        <div class="qpt-actions">
          <button class="qpt-btn danger" data-action="finish-practice">Finish & Review</button>
          <button class="qpt-btn" data-action="new-question">New Question</button>
        </div>
      </div>
    `;

    const answer = document.getElementById("qpt-answer");
    answer.addEventListener("input", () => {
      const words = answer.value.trim() ? answer.value.trim().split(/\s+/).length : 0;
      document.getElementById("qpt-words").textContent = words;
    });

    stopTimer();
    practiceTimer = setInterval(() => {
      practiceSeconds--;
      const el = document.getElementById("qpt-timer");
      if (el) el.textContent = formatTime(Math.max(0, practiceSeconds));
      if (practiceSeconds <= 0) finishPractice();
    }, 1000);
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function stopTimer() {
    if (practiceTimer) clearInterval(practiceTimer);
    practiceTimer = null;
  }

  function finishPractice() {
    stopTimer();
    if (!currentPractice) return;
    mark(currentPractice.id, "attempted");

    const r = getRecord(currentPractice.id);
    const qid = currentPractice.id;

    openModal("Self Review", `
      <div class="qpt-card">
        <div class="qpt-question small">${esc(currentPractice.question)}</div>
        <div class="qpt-review-grid">
          ${["intro","structure","content","examples","analysis","conclusion"].map(k => `
            <label>${k.charAt(0).toUpperCase()+k.slice(1)}
              <select data-review="${k}">
                <option value="0">Not reviewed</option>
                <option value="1">Weak</option>
                <option value="2">Average</option>
                <option value="3">Good</option>
                <option value="4">Excellent</option>
                <option value="5">Excellent+</option>
              </select>
            </label>
          `).join("")}
        </div>
        <label>What was missing?
          <textarea id="qpt-review-note" placeholder="Data, examples, dimensions, committee, judgment, conclusion, etc."></textarea>
        </label>
        <div class="qpt-actions">
          <button class="qpt-btn" data-action="save-review" data-id="${esc(qid)}">Save review</button>
          <button class="qpt-btn primary" data-action="master-question" data-id="${esc(qid)}">Mark as revised</button>
        </div>
      </div>
    `);
  }

  function revision() {
    bank = getBank().map(normalize);
    const items = bank.filter(q => {
      const s = getRecord(q.id).status;
      return s === "needs_revision" || s === "attempted";
    }).slice(0, 50);

    openModal("Revision Queue", `
      <div class="qpt-card">
        <div class="qpt-card-head"><b>${items.length} questions in your revision queue</b></div>
        ${items.length ? items.map(q => `
          <div class="qpt-revision-item">
            <div>
              <div class="qpt-mini-meta">${esc(q.paper)} · ${esc(q.topic)} · ${q.year}</div>
              <div>${esc(q.question)}</div>
            </div>
            <div class="qpt-status">${statusLabel(getRecord(q.id).status)}</div>
            <button class="qpt-btn tiny" data-action="mark-revised" data-id="${esc(q.id)}">✓ Revised</button>
          </div>
        `).join("") : `<div class="qpt-empty">Nothing is waiting for revision. Good work.</div>`}
      </div>
    `);
  }

  function saveReview(id) {
    const r = getRecord(id);
    document.querySelectorAll("[data-review]").forEach(sel => {
      r.review[sel.dataset.review] = Number(sel.value);
    });
    r.reviewNote = document.getElementById("qpt-review-note")?.value || "";
    r.status = "needs_revision";
    r.lastAttempted = new Date().toISOString();
    saveState();
    alert("Self-review saved.");
  }

  function related(q) {
    bank = getBank().map(normalize);
    if (window.Fuse) {
      const f = new Fuse(bank.filter(x => x.id !== q.id), {
        includeScore: true,
        threshold: 0.45,
        keys: ["question","topic","paper"]
      });
      return f.search(q.question).slice(0,5).map(x => x.item);
    }
    const words = new Set(q.question.toLowerCase().split(/\W+/).filter(w => w.length > 4));
    return bank.filter(x => x.id !== q.id)
      .map(x => ({x, score: [...new Set(x.question.toLowerCase().split(/\W+/))].filter(w => words.has(w)).length}))
      .sort((a,b)=>b.score-a.score).slice(0,5).map(x=>x.x);
  }

  function bindToolEvents() {
    document.querySelectorAll("[data-action]").forEach(btn => {
      btn.onclick = () => {
        const action = btn.dataset.action;
        if (action === "practice") practice();
        if (action === "revision") revision();
        if (action === "start-practice") startPractice();
        if (action === "finish-practice") finishPractice();
        if (action === "new-question") practice();
        if (action === "save-review") saveReview(btn.dataset.id);
        if (action === "master-question") { mark(btn.dataset.id, "revised"); revision(); }
        if (action === "mark-revised") { mark(btn.dataset.id, "revised"); revision(); }
        if (action === "export") exportProgress();
        if (action === "import") importProgress();
      };
    });
  }

  function exportProgress() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      progress: state,
      notes
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "qcab-upsc-progress.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function importProgress() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        if (data.progress && typeof data.progress === "object") {
          Object.assign(state, data.progress);
          saveState();
        }
        if (data.notes && typeof data.notes === "object") {
          Object.assign(notes, data.notes);
          saveNotes();
        }
        alert("Progress imported successfully.");
        dashboard();
      } catch (_) {
        alert("Invalid progress file.");
      }
    };
    input.click();
  }

  function openTool(tool) {
    if (tool === "dashboard") dashboard();
    if (tool === "practice") practice();
    if (tool === "revision") revision();
  }

  // Public helper: other parts of QCAB can call this for a question.
  window.QCABPrepTools = {
    mark,
    getRecord,
    related,
    dashboard,
    practice,
    revision,
    saveNote: function(id, text) {
      notes[id] = text;
      saveNotes();
    },
    getNote: function(id) {
      return notes[id] || "";
    }
  };

  function boot() {
    injectUI();
    // Refresh bank when the existing QCAB app finishes loading.
    setTimeout(() => { bank = getBank().map(normalize); }, 1500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
