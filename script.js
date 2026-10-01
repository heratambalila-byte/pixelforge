const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  mobileNav.hidden = true;
  document.body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  mobileNav.hidden = isOpen;
  document.body.classList.toggle('menu-open', !isOpen);
});

mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMenu();
    menuToggle.focus();
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const sections = document.querySelectorAll('main > section');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });

  sections.forEach(section => revealObserver.observe(section));
  document.body.classList.add('reveal-enabled');
}

if (window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  document.querySelectorAll('.purpose-card, .service-card, .process-grid li, .price-card, .operations-grid article').forEach(card => {
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--hover-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
      card.style.setProperty('--hover-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--hover-x');
      card.style.removeProperty('--hover-y');
    });
  });
}
