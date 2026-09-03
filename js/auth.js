// ============================================================
// js/auth.js – Authentication & Login Modal
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
  if (!modal) {
    console.error('Login modal not found');
    return;
  }

  const title = document.getElementById('login-modal-title');
  const sub = document.getElementById('login-modal-sub');
  const submitBtn = document.getElementById('login-submit-btn');
  const switchText = document.getElementById('login-switch-text');
  const switchLink = document.getElementById('login-switch-link');
  const error = document.getElementById('login-error');

  const isLogin = mode === 'login';
  if (title) title.textContent = isLogin ? 'Welcome Back' : 'Create Account';
  if (sub) sub.textContent = isLogin ? 'Sign in to access AI answers and sync your study data.' : 'Register to save your bookmarks and access AI answers.';
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

  if (!modal) {
    console.warn('Login modal not found – skipping initAuth');
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
    console.warn('Close button not found');
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
      alert('Google login is not configured yet. Use email/password or continue as guest.');
    });
  }

  // Submit login/register
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
        const res = await fetch(WORKER_URL + endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Authentication failed.');

        setUser({ email, token: data.token || data.key || 'dummy-token' });
        closeLoginModal();
        alert(isLogin ? 'Welcome back!' : 'Account created!');

        // Reload study data and refresh UI
        if (typeof loadCloudStudy === 'function') loadCloudStudy();
        if (typeof renderBankResults === 'function') renderBankResults();
        if (typeof updateStudyDashboard === 'function') updateStudyDashboard();

      } catch (err) {
        if (error) {
          error.textContent = err.message || 'Something went wrong. Please try again.';
          error.style.display = 'block';
        }
      }
    });
  }

  // Allow Enter key on login fields
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  if (emailInput) {
    emailInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') submitBtn?.click();
    });
  }
  if (passwordInput) {
    passwordInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') submitBtn?.click();
    });
  }

  updateAuthUI();
  console.log('✅ Auth initialized');
}
