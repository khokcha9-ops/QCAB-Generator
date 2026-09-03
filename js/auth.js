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
