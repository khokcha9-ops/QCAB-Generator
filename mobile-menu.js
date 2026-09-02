/* QCAB Mobile Menu - integrated with the EXISTING mobile header */
(function () {
  function initQCABMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const mobileNav = document.querySelector('.mobile-nav');

    if (!sidebar || !mobileNav) {
      console.warn('QCAB Mobile Menu: sidebar or mobile-nav not found.');
      return;
    }

    /* Avoid creating the button twice */
    if (document.querySelector('.qcab-mobile-menu-btn')) return;

    const overlay = document.createElement('div');
    overlay.className = 'qcab-mobile-overlay';
    document.body.appendChild(overlay);

    const btn = document.createElement('button');
    btn.className = 'qcab-mobile-menu-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open navigation menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '☰';

    /* Put hamburger inside the header that already appears on mobile */
    mobileNav.insertBefore(btn, mobileNav.firstChild);

    function openMenu() {
      sidebar.classList.add('qcab-mobile-open');
      overlay.classList.add('is-open');
      btn.classList.add('is-open');
      btn.innerHTML = '✕';
      btn.setAttribute('aria-label', 'Close navigation menu');
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('qc-mobile-menu-open');
    }

    function closeMenu() {
      sidebar.classList.remove('qcab-mobile-open');
      overlay.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.innerHTML = '☰';
      btn.setAttribute('aria-label', 'Open navigation menu');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('qc-mobile-menu-open');
    }

    btn.addEventListener('click', function () {
      sidebar.classList.contains('qcab-mobile-open') ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    /* Existing sidebar uses buttons, not links */
    sidebar.addEventListener('click', function (event) {
      if (event.target.closest('button')) {
        setTimeout(closeMenu, 100);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQCABMobileMenu);
  } else {
    initQCABMobileMenu();
  }
})();
