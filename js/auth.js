// js/auth.js - Login/Register functions

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
  const loginTexts = document.querySelectorAll('#sidebar-login-text, #topbar-login-text');
  loginTexts.forEach(el => {
    if (el) el.textContent = isLoggedIn ? user?.email || 'Account' : 'Login';
  });
}

function openLoginModal(mode) {
  // This will be called when login button is clicked
  alert('Login modal would open here');
  // You'll add the actual modal later
}
// js/auth.js

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

// Open/Close modal
function openLoginModal(mode = 'login') {
  const modal = document.getElementById('login-modal');
  const title = document.getElementById('login-modal-title');
  const sub = document.getElementById('login-modal-sub');
  const submitBtn = document.getElementById('login-submit-btn');
  const switchText = document.getElementById('login-switch-text');
  const switchLink = document.getElementById('login-switch-link');
  const error = document.getElementById('login-error');
  
  const isLogin = mode === 'login';
  title.textContent = isLogin ? 'Welcome Back' : 'Create Account';
  sub.textContent = isLogin ? 'Sign in to access AI answers.' : 'Register to save your bookmarks.';
  submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
  switchText.textContent = isLogin ? "Don't have an account?" : 'Already have an account?';
  switchLink.textContent = isLogin ? 'Sign up' : 'Sign In';
  error.style.display = 'none';
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  modal.classList.add('open');
}

function closeLoginModal() {
  document.getElementById('login-modal').classList.remove('open');
}

// Event listeners (to be called from app.js)
function initAuth() {
  const modal = document.getElementById('login-modal');
  const closeBtn = document.getElementById('login-modal-close');
  const submitBtn = document.getElementById('login-submit-btn');
  const switchLink = document.getElementById('login-switch-link');
  const guestBtn = document.getElementById('guest-login-btn'); // if you have one
  
  closeBtn?.addEventListener('click', closeLoginModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeLoginModal(); });
  
  // Login/Register submission
  submitBtn?.addEventListener('click', async function() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const error = document.getElementById('login-error');
    if (!email || !password) {
      error.textContent = 'Please fill in all fields.';
      error.style.display = 'block';
      return;
    }
    error.style.display = 'none';
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
      setUser({ email, token: data.token || 'dummy' });
      closeLoginModal();
      alert(isLogin ? 'Welcome back!' : 'Account created!');
      // Reload study data if needed
      if (typeof loadCloudStudy === 'function') loadCloudStudy();
      if (typeof renderBankResults === 'function') renderBankResults();
      if (typeof updateStudyDashboard === 'function') updateStudyDashboard();
    } catch (err) {
      error.textContent = err.message || 'Something went wrong.';
      error.style.display = 'block';
    }
  });
  
  // Switch between login/register
  switchLink?.addEventListener('click', function() {
    const isLogin = submitBtn.textContent === 'Sign In';
    openLoginModal(isLogin ? 'register' : 'login');
  });
  
  // Google button placeholder
  document.getElementById('google-login-btn')?.addEventListener('click', function() {
    alert('Google login is not configured yet. Use email/password or guest mode.');
  });
  
  updateAuthUI();
}
