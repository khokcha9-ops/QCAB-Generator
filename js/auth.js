// ============================================================
// js/auth.js – Authentication (with mock fallback)
// ============================================================

function getUser() {
  try {
    const data = JSON.parse(localStorage.getItem('qcab_user'));
    if (data && data.email) return data;
  } catch (_) { return null; }
  return null;
}

function setUser(user) {
  if (user) {
    localStorage.setItem('qcab_user', JSON.stringify(user));
    localStorage.setItem('userToken', user.token || '');
    localStorage.setItem('qcab_owner_key', user.token || '');
  } else {
    localStorage.removeItem('qcab_user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('qcab_owner_key');
  }
  updateAuthUI();
}

function updateAuthUI() {
  const user = getUser();
  const isLoggedIn = !!user;
  document.querySelectorAll('#sidebar-login-text, #topbar-login-text').forEach(el => {
    if (el) el.textContent = isLoggedIn ? user?.email || 'Account' : 'Login';
  });
}

function openLoginModal(mode = 'login') {
  const modal = document.getElementById('login-modal');
  if (!modal) return;

  const title = document.getElementById('login-modal-title');
  const sub = document.getElementById('login-modal-sub');
  const submitBtn = document.getElementById('login-submit-btn');
  const switchText = document.getElementById('login-switch-text');
  const switchLink = document.getElementById('login-switch-link');
  const error = document.getElementById('login-error');

  const isLogin = mode === 'login';
  if (title) title.textContent = isLogin ? 'Welcome Back' : 'Create Account';
  if (sub) sub.textContent = isLogin ? 'Sign in to access AI answers.' : 'Register to save your bookmarks.';
  if (submitBtn) submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
  if (switchText) switchText.textContent = isLogin ? "Don't have an account?" : 'Already have an account?';
  if (switchLink) switchLink.textContent = isLogin ? 'Sign up' : 'Sign In';
  if (error) error.style.display = 'none';

  const email = document.getElementById('login-email');
  const password = document.getElementById('login-password');
  if (email) email.value = '';
  if (password) password.value = '';

  modal.classList.add('open');
}

function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.classList.remove('open');
}

function initAuth() {
  const modal = document.getElementById('login-modal');
  const closeBtn = document.getElementById('login-modal-close');
  const submitBtn = document.getElementById('login-submit-btn');
  const switchLink = document.getElementById('login-switch-link');
  const googleBtn = document.getElementById('google-login-btn');
  const error = document.getElementById('login-error');

  if (!modal) return;

  // Close on backdrop click
  modal.addEventListener('click', function(e) {
    if (e.target === this) closeLoginModal();
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeLoginModal();
    });
  }

  // Switch between login/register
  if (switchLink) {
    switchLink.addEventListener('click', function() {
      const isLogin = submitBtn?.textContent === 'Sign In';
      openLoginModal(isLogin ? 'register' : 'login');
    });
  }

  // Google button placeholder
  if (googleBtn) {
    googleBtn.addEventListener('click', function() {
      alert('Google login is not configured yet. Use email/password.');
    });
  }

  // Submit login/register with MOCK FALLBACK
  if (submitBtn) {
    submitBtn.addEventListener('click', async function() {
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();
      if (!email || !password) {
        if (error) {
          error.textContent = 'Please fill in all fields.';
          error.style.display = 'block';
        }
        return;
      }
      if (error) error.style.display = 'none';

      const isLogin = submitBtn.textContent === 'Sign In';
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

      try {
        // Try real API first
        const res = await fetch(WORKER_URL + endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
          // If endpoint not found, fallback to mock login
          if (res.status === 404) {
            throw new Error('Endpoint not found – using mock login.');
          }
          const data = await res.json();
          throw new Error(data.error || 'Authentication failed.');
        }

        const data = await res.json();
        setUser({ email, token: data.token || 'dummy-token' });
        closeLoginModal();
        alert(isLogin ? 'Welcome back!' : 'Account created! (Real API)');

      } catch (err) {
        // MOCK FALLBACK – allow any email/password
        if (err.message.includes('mock') || err.message.includes('Endpoint not found')) {
          // Mock success
          setUser({ email, token: 'mock-token-' + Date.now() });
          closeLoginModal();
          alert(isLogin ? 'Welcome back! (Mock mode)' : 'Account created! (Mock mode)');
        } else {
          if (error) {
            error.textContent = err.message || 'Something went wrong.';
            error.style.display = 'block';
          }
        }
      }

      // Refresh UI after login
      if (typeof loadCloudStudy === 'function') loadCloudStudy();
      if (typeof renderBankResults === 'function') renderBankResults();
      if (typeof updateStudyDashboard === 'function') updateStudyDashboard();
    });
  }

  // Enter key support
  document.getElementById('login-email')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitBtn?.click();
  });
  document.getElementById('login-password')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitBtn?.click();
  });

  updateAuthUI();
  console.log('✅ Auth initialized (with mock fallback)');
}
