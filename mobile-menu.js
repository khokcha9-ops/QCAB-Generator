/* QCAB Mobile Menu - uses the existing desktop sidebar */
(function(){
  function initMobileMenu(){
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar || document.querySelector('.qcab-mobile-menu-btn')) return;

    const overlay=document.createElement('div');
    overlay.className='qcab-mobile-overlay';

    const btn=document.createElement('button');
    btn.className='qcab-mobile-menu-btn';
    btn.type='button';
    btn.setAttribute('aria-label','Open navigation menu');
    btn.setAttribute('aria-expanded','false');
    btn.innerHTML='☰';

    const header=document.querySelector('.topbar,.header,.app-header,header');
    if(header) header.prepend(btn);
    else document.body.prepend(btn);
    document.body.appendChild(overlay);

    function openMenu(){
      sidebar.classList.add('qcab-mobile-open');
      overlay.classList.add('is-open');
      btn.innerHTML='✕';
      btn.setAttribute('aria-label','Close navigation menu');
      btn.setAttribute('aria-expanded','true');
      document.body.style.overflow='hidden';
    }
    function closeMenu(){
      sidebar.classList.remove('qcab-mobile-open');
      overlay.classList.remove('is-open');
      btn.innerHTML='☰';
      btn.setAttribute('aria-label','Open navigation menu');
      btn.setAttribute('aria-expanded','false');
      document.body.style.overflow='';
    }

    btn.addEventListener('click',()=>{
      sidebar.classList.contains('qcab-mobile-open') ? closeMenu() : openMenu();
    });
    overlay.addEventListener('click',closeMenu);
    sidebar.addEventListener('click',(e)=>{
      if(e.target.closest('a,button') && window.innerWidth<=768) setTimeout(closeMenu,80);
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape') closeMenu()});
    window.addEventListener('resize',()=>{if(window.innerWidth>768) closeMenu()});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initMobileMenu);
  else initMobileMenu();
})();
