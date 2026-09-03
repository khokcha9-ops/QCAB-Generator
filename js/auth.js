// ============================================================
// js/auth.js – Authentication & Login Modal
// ============================================================

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
  if (!modal) return;

  const title = document.getElementById('login-modal-title');
  const sub = document.getElementById('login-modal-sub');
  const submitBtn = document.getElementById('login-submit-btn');
  const switchText = document.getElementById('login-switch-text');
  const switchLink = document.getElementById('login-switch-link');
  const error = document.getElementById('login-error');

  const isLogin = mode === 'login';
  title.textContent = isLogin ? 'Welcome Back' : 'Create Account';
  sub.textContent = isLogin ? 'Sign in to access AI answers and sync your study data.' : 'Register to save your bookmarks and access AI answers.';
  submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
  switchText.textContent = isLogin ? "Don't have an account?" : 'Already have an account?';
  switchLink.textContent = isLogin ? 'Sign up' : 'Sign In';
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

// ----- Initialization: attach event listeners -----
function initAuth() {
  const modal = document.getElementById('login-modal');
  const closeBtn = document.getElementById('login-modal-close');
  const submitBtn = document.getElementById('login-submit-btn');
  const switchLink = document.getElementById('login-switch-link');
  const googleBtn = document.getElementById('google-login-btn');
  const error = document.getElementById('login-error');

  // Close on backdrop click
  modal?.addEventListener('click', function(e) {
    if (e.target === this) closeLoginModal();
  });

  // Close button
  closeBtn?.addEventListener('click', closeLoginModal);

  // Switch between login/register
  switchLink?.addEventListener('click', function() {
    const isLogin = submitBtn?.textContent === 'Sign In';
    openLoginModal(isLogin ? 'register' : 'login');
  });

  // Google button placeholder
  googleBtn?.addEventListener('click', function() {
    alert('Google login is not configured yet. Use email/password or guest mode.');
  });

  // Submit login/register
  submitBtn?.addEventListener('click', async function() {
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

      // Success
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

  // Allow Enter key on login fields
  document.getElementById('login-email')?.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') submitBtn?.click();
  });
  document.getElementById('login-password')?.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') submitBtn?.click();
  });

  // Update UI on load
  updateAuthUI();
}

// Make functions globally accessible
