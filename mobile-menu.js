/* ==========================================
   MOBILE MENU
   Turns the existing sidebar into a slide-in
   drawer on small screens. Works for both the
   built-in nav (Dashboard / PYQ Bank / Create
   Question / My QCAB) and the "Preparation"
   group injected by upsc-prep-tools.js, since
   it targets .sidebar directly instead of
   duplicating the menu markup.
   ========================================== */
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const mobileNav = document.querySelector(".mobile-nav");
  if (!sidebar || !mobileNav) return;

  // Hamburger button, injected into the existing mobile top bar
  const toggle = document.createElement("button");
  toggle.id = "mobile-menu-toggle";
  toggle.className = "mobile-menu-toggle";
  toggle.setAttribute("aria-label", "Open menu");
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = "☰";
  mobileNav.appendChild(toggle);

  // Backdrop, click to dismiss
  const backdrop = document.createElement("div");
  backdrop.className = "mobile-menu-backdrop";
  document.body.appendChild(backdrop);

  // Close (×) button inside the drawer itself
  const closeBtn = document.createElement("button");
  closeBtn.className = "mobile-menu-close";
  closeBtn.setAttribute("aria-label", "Close menu");
  closeBtn.innerHTML = "×";
  sidebar.prepend(closeBtn);

  function openMenu() {
    sidebar.classList.add("mobile-open");
    backdrop.classList.add("active");
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    sidebar.classList.remove("mobile-open");
    backdrop.classList.remove("active");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);

  // Close the drawer once a nav item is picked (event delegation, so this
  // also covers nav buttons injected later, e.g. by upsc-prep-tools.js)
  sidebar.addEventListener("click", function (e) {
    if (e.target.closest(".nav-btn")) closeMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });
});
