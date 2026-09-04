// ============================================================
// js/auth.js – Authentication (robust version)
// ============================================================

// Ensure WORKER_URL is defined (fallback)
if (typeof WORKER_URL === 'undefined') {
  var WORKER_URL = 'https://qcap-ai-v2.khokcha9.workers.dev';
  console.warn('WORKER_URL not found in config.js – using default.');
}

// ----- User session management -----
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

// ----- Login Modal controls -----
function openLoginModal(mode = 'login') {
  const modal = document.getElementById('login-modal');
  if (!modal) {
    console.error('Login modal element (#login-modal) not found.');
    return;
  }

  const title = document.getElementById('login-modal-title');
  const sub = document.getElementById('login-modal-sub');
  const submitBtn = document.getElementById('login-submit-btn');
  const switchText = document.getElementById('login-switch-text');
  const switchLink = document.getElementById('login-switch-link');
  const error = document.getElementById('login-error');
  const nameField = document.getElementById('login-name-field');

  const isLogin = mode === 'login';
  if (title) title.textContent = isLogin ? 'Welcome Back' : 'Create Account';
  if (sub) sub.textContent = isLogin ? 'Sign in to access AI answers.' : 'Register to save your bookmarks.';
  if (submitBtn) submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
  if (switchText) switchText.textContent = isLogin ? "Don't have an account?" : 'Already have an account?';
  if (switchLink) switchLink.textContent = isLogin ? 'Sign up' : 'Sign In';
  if (error) error.style.display = 'none';

  // Show/hide name field for registration
  if (nameField) {
    nameField.style.display = isLogin ? 'none' : 'block';
  }

  const email = document.getElementById('login-email');
  const password = document.getElementById('login-password');
  const nameInput = document.getElementById('login-name');
  if (email) email.value = '';
  if (password) password.value = '';
  if (nameInput) nameInput.value = '';

  modal.classList.add('open');
}

function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.classList.remove('open');
}

// ----- Initialization: attach event listeners -----
function initAuth() {
  const modal = document.getElementById('login-modal');
  const closeBtn = document.getElementById('login-modal-close');
  const submitBtn = document.getElementById('login-submit-btn');
  const switchLink = document.getElementById('login-switch-link');
  const googleBtn = document.getElementById('google-login-btn');
  const error = document.getElementById('login-error');

  if (!modal) {
    console.warn('Login modal not found – check HTML for #login-modal');
    return;
  }

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
  } else {
    console.warn('Close button #login-modal-close not found');
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

  // Submit login/register
  if (submitBtn) {
    submitBtn.addEventListener('click', async function() {
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();
      const name = document.getElementById('login-name')?.value.trim() || 'User';
      const isLogin = submitBtn.textContent === 'Sign In';

      if (!email || !password) {
        if (error) {
          error.textContent = 'Please fill in all fields.';
          error.style.display = 'block';
        }
        return;
      }

      // For registration, name is required
      if (!isLogin && !name) {
        if (error) {
          error.textContent = 'Please enter your name.';
          error.style.display = 'block';
        }
        return;
      }

      if (error) error.style.display = 'none';

      // Correct endpoints (no "/auth" in path)
      const endpoint = isLogin ? '/api/login' : '/api/register';

      try {
        let body = { email, password };
        if (!isLogin) body.name = name;

        const res = await fetch(WORKER_URL + endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Authentication failed.');
        }

        // Success
        setUser({
          email,
          token: data.token || 'dummy-token',
          userId: data.userId,
          name: data.name || name
        });
        closeLoginModal();
        alert(isLogin ? 'Welcome back!' : 'Account created!');

        // Refresh UI
        if (typeof loadCloudStudy === 'function') loadCloudStudy();
        if (typeof renderBankResults === 'function') renderBankResults();
        if (typeof updateStudyDashboard === 'function') updateStudyDashboard();

      } catch (err) {
        // MOCK FALLBACK – if Worker not deployed, allow mock login
        if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
          // Mock success (any email/password works)
          setUser({ email, token: 'mock-token-' + Date.now(), name: name || 'User' });
          closeLoginModal();
          alert(isLogin ? 'Welcome back! (Mock mode)' : 'Account created! (Mock mode)');
          // Refresh UI
          if (typeof loadCloudStudy === 'function') loadCloudStudy();
          if (typeof renderBankResults === 'function') renderBankResults();
          if (typeof updateStudyDashboard === 'function') updateStudyDashboard();
        } else {
          if (error) {
            error.textContent = err.message || 'Something went wrong.';
            error.style.display = 'block';
          }
        }
      }
    });
  }

  // Enter key support
  document.getElementById('login-email')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitBtn?.click();
  });
  document.getElementById('login-password')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitBtn?.click();
  });
  document.getElementById('login-name')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitBtn?.click();
  });

  updateAuthUI();
  console.log('✅ Auth initialized (endpoints: /api/login, /api/register)');
}
