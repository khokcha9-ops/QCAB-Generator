// js/app.js - Main application

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  
  // ============================
  // NAVIGATION
  // ============================
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.scroll;
      const target = document.getElementById(id);
      if (target) {
        const offset = window.innerWidth <= 820 ? 70 : 10;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Adjust for offset
        window.scrollBy(0, -offset);
      }
      document.querySelectorAll('.nav-btn[data-scroll]').forEach(n => n.classList.remove('active'));
      const match = document.querySelector(`.nav-btn[data-scroll="${id}"]`);
      if(match) match.classList.add('active');
    });
  });

  // ============================
  // THEME
  // ============================
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

  // ============================
  // MOBILE MENU
  // ============================
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

  // ============================
  // SYLLABUS is now loaded from config.js
  // ============================
  // All SYLLABUS functions use the global SYLLABUS variable from config.js

  // ============================
  // BANK COLLAPSE FIX
  // ============================
  const toggleBankBtn = document.getElementById('toggle-bank-btn');
  const toggleBankIcon = document.getElementById('toggle-bank-icon');
  const toggleBankText = document.getElementById('toggle-bank-text');
  const bankBody = document.getElementById('pyq-bank-body');
  
  // FORCE BANK TO BE VISIBLE ON LOAD
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

  // ============================
  // CREATE FORM COLLAPSE
  // ============================
  const toggleCreateBtn = document.getElementById('toggle-create-section-btn');
  const createFormBody = document.getElementById('create-form-body');
  if (toggleCreateBtn && createFormBody) {
    toggleCreateBtn.addEventListener('click', () => {
      const isHidden = createFormBody.style.display === 'none';
      createFormBody.style.display = isHidden ? 'block' : 'none';
      toggleCreateBtn.textContent = isHidden ? 'Hide Form ▾' : 'Show Form ▸';
    });
  }

  // ============================
  // POPULATE SUBTOPICS (from SYLLABUS)
  // ============================
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

  // ============================
  // DASHBOARD SYNC
  // ============================
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

  // ============================
  // SCROLL TO TOP
  // ============================
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

  // ============================
  // INITIAL LOAD
  // ============================
  syncDashboard();
  setTimeout(syncDashboard, 700);
  setTimeout(syncDashboard, 1800);

  console.log('✅ QCAB Generator loaded successfully!');
  console.log('📋 Subtopics count:', Object.keys(SYLLABUS).length);
});
document.getElementById('topbar-login-btn')?.addEventListener('click', () => {
  const user = getUser();
  if (user) {
    if (confirm('Logout?')) { setUser(null); alert('Logged out.'); }
  } else {
    openLoginModal('login');
  }
});

document.getElementById('sidebar-login-btn')?.addEventListener('click', () => {
  const user = getUser();
  if (user) {
    if (confirm('Logout?')) { setUser(null); alert('Logged out.'); }
  } else {
    openLoginModal('login');
  }
});
