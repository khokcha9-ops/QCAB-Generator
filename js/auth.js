// ============================================================
// js/auth.js – Authentication (with fallbacks)
// ============================================================

console.log('🔐 auth.js loaded');

// Fallback for WORKER_URL
if (typeof WORKER_URL === 'undefined') {
  var WORKER_URL = 'https://qcap-ai-v2.khokcha9.workers.dev';
}

// ----- User session -----
window.getUser = function() {
  try {
    const data = JSON.parse(localStorage.getItem('qcab_user'));
    if (data && data.email) return data;
  } catch (_) { return null; }
  return null;
};

window.setUser = function(user) {
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
};

function updateAuthUI() {
  const user = window.getUser();
  const isLoggedIn = !!user;
  document.querySelectorAll('#sidebar-login-text, #topbar-login-text').forEach(el => {
    if (el) el.textContent = isLoggedIn ? user?.email || 'Account' : 'Login';
  });
}

// ----- Login Modal (GLOBAL) -----
window.openLoginModal = function(mode = 'login') {
  console.log('🚪 openLoginModal called with mode:', mode);
  
  // Try to find modal by ID
  let modal = document.getElementById('login-modal');
  
  // If not found, try by class
  if (!modal) {
    modal = document.querySelector('.login-modal');
    console.log('🔍 Looking for modal by class...');
  }
  
  if (!modal) {
    console.error('❌ Login modal not found!');
    alert('Login modal not found. Please refresh the page.');
    return;
  }

  console.log('✅ Login modal found, opening...');
  
  const isLogin = mode === 'login';
  const title = document.getElementById('login-modal-title');
  const sub = document.getElementById('login-modal-sub');
  const submitBtn = document.getElementById('login-submit-btn');
  const switchText = document.getElementById('login-switch-text');
  const switchLink = document.getElementById('login-switch-link');
  const error = document.getElementById('login-error');
  const nameField = document.getElementById('login-name-field');

  if (title) title.textContent = isLogin ? 'Welcome Back' : 'Create Account';
  if (sub) sub.textContent = isLogin ? 'Sign in to access AI answers.' : 'Register to save your bookmarks.';
  if (submitBtn) submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
  if (switchText) switchText.textContent = isLogin ? "Don't have an account?" : 'Already have an account?';
  if (switchLink) switchLink.textContent = isLogin ? 'Sign up' : 'Sign In';
  if (error) error.style.display = 'none';
  if (nameField) nameField.style.display = isLogin ? 'none' : 'block';

  const email = document.getElementById('login-email');
  const password = document.getElementById('login-password');
  const nameInput = document.getElementById('login-name');
  if (email) email.value = '';
  if (password) password.value = '';
  if (nameInput) nameInput.value = '';

  modal.classList.add('open');
  console.log('✅ Modal opened, classList:', modal.classList);
};

window.closeLoginModal = function() {
  console.log('🚪 closeLoginModal called');
  const modal = document.getElementById('login-modal') || document.querySelector('.login-modal');
  if (modal) modal.classList.remove('open');
};

// ----- Init Auth (GLOBAL) -----
window.initAuth = function() {
  console.log('🔧 initAuth called');
  
  const modal = document.getElementById('login-modal') || document.querySelector('.login-modal');
  const closeBtn = document.getElementById('login-modal-close');
  const submitBtn = document.getElementById('login-submit-btn');
  const switchLink = document.getElementById('login-switch-link');
  const googleBtn = document.getElementById('google-login-btn');
  const error = document.getElementById('login-error');

  if (!modal) {
    console.warn('⚠️ Login modal not found. Skipping auth init.');
    return;
  }

  // Close on backdrop click
  modal.addEventListener('click', function(e) {
    if (e.target === this) window.closeLoginModal();
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      window.closeLoginModal();
    });
  }

  // Switch login/register
  if (switchLink) {
    switchLink.addEventListener('click', function() {
      const isLogin = submitBtn?.textContent === 'Sign In';
      window.openLoginModal(isLogin ? 'register' : 'login');
    });
  }

  // Google button
  if (googleBtn) {
    googleBtn.addEventListener('click', function() {
      if (typeof showAlert === 'function') {
        showAlert('Google login is not configured yet.', 'Not Available');
      } else {
        alert('Google login is not configured yet.');
      }
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

      if (!isLogin && !name) {
        if (error) {
          error.textContent = 'Please enter your name.';
          error.style.display = 'block';
        }
        return;
      }

      if (error) error.style.display = 'none';

      const endpoint = isLogin ? '/api/login' : '/api/register';

      try {
        const body = { email, password };
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

        window.setUser({
          email,
          token: data.token || 'dummy-token',
          userId: data.userId,
          name: data.name || name
        });

        window.closeLoginModal();
        if (typeof showAlert === 'function') {
          showAlert(isLogin ? 'Welcome back!' : 'Account created!', 'Success');
        } else {
          alert(isLogin ? 'Welcome back!' : 'Account created!');
        }

        if (typeof loadCloudStudy === 'function') loadCloudStudy();
        if (typeof renderBankResults === 'function') renderBankResults();
        if (typeof updateStudyDashboard === 'function') updateStudyDashboard();

      } catch (err) {
        // Mock fallback
        if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
          window.setUser({ email, token: 'mock-token-' + Date.now(), name: name || 'User' });
          window.closeLoginModal();
          if (typeof showAlert === 'function') {
            showAlert(isLogin ? 'Welcome back! (Mock mode)' : 'Account created! (Mock mode)', 'Mock Mode');
          } else {
            alert(isLogin ? 'Welcome back! (Mock mode)' : 'Account created! (Mock mode)');
          }
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
  console.log('✅ Auth initialized');
};

// Self-execute: make sure all functions are registered
console.log('✅ Auth functions registered:');
console.log('  - getUser:', typeof window.getUser);
console.log('  - setUser:', typeof window.setUser);
console.log('  - openLoginModal:', typeof window.openLoginModal);
console.log('  - closeLoginModal:', typeof window.closeLoginModal);
console.log('  - initAuth:', typeof window.initAuth);
