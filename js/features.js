// ============================================================
// SIMPLIFIED FEATURES.JS (Isolated, no conflict with app.js)
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Features.js loaded');

  // 1. GAMIFICATION & STREAK
  function updateStreak() {
    const user = window.getUser ? window.getUser() : null;
    if (!user) return;

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    let data = JSON.parse(localStorage.getItem('user_progress')) || { xp: 0, streak: 0, last_active_date: today };

    // Calculate Daily XP (10 XP per day for just opening the site)
    if (data.last_active_date !== today) {
      data.xp += 10;
      if (data.last_active_date === yesterday) data.streak += 1;
      else data.streak = 1;
      data.last_active_date = today;
      localStorage.setItem('user_progress', JSON.stringify(data));
    }

    document.getElementById('sidebar-streak').textContent = data.streak;
    document.getElementById('sidebar-xp').textContent = data.xp;
    
    // OPTIONAL: Push to Cloudflare DB
    if (user.token && window.WORKER_URL) {
      fetch(WORKER_URL + '/api/progress/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + user.token },
        body: JSON.stringify({ xp: data.xp, streak: data.streak, last_active_date: today })
      }).catch(() => {});
    }
  }
  updateStreak();

  // 2. SYLLABUS COVERAGE TRACKER
  function updateCoverage() {
    const totalQuestions = (window.presetBank || []).length;
    const revised = Object.values(window.studyData || {}).filter(d => d.revised).length;
    const pct = totalQuestions > 0 ? Math.round((revised / totalQuestions) * 100) : 0;
    document.getElementById('coverage-fill').style.width = pct + '%';
    document.getElementById('coverage-text').textContent = pct + '% Revised';
  }
  updateCoverage();

  // Hook into the existing render function (app.js runs first)
  const origUpdate = window.updateStudyDashboard;
  if (origUpdate) {
    window.updateStudyDashboard = function() {
      origUpdate.apply(this, arguments);
      updateCoverage();
    };
  }

  // 3. ADAPTIVE QUICK TEST GENERATOR (10 Random PYQs)
  window.generateQuickTest = function() {
    if (!window.presetBank || window.presetBank.length === 0) {
      alert('Question bank not loaded yet.');
      return;
    }
    const shuffled = [...window.presetBank].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    selected.forEach(q => {
      window.getActiveFolder().questions.push({
        question: q.question, marks: q.marks, year: q.year, paper: q.paper, topic: q.topic
      });
    });
    window.saveState();
    window.renderQuestions();
    alert('🔥 10 Random Questions added to your QCAB!');
    document.querySelector('[data-scroll="my-qcab"]')?.click();
  };

});
